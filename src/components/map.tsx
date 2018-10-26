import GoogleMapReact from 'google-map-react'
import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import { Trip } from '../api/trip'
import { CoordinateItem, PathType, Point, Route } from '../maps'

const getPolylinePropsForPathType = (
	pathType: PathType,
	colorIndex: number = 0
) => {
	switch (pathType) {
		case 'legit':
			return {
				strokeColor: `hsl(${(240 + 60 * colorIndex) % 360}, 32.7%, 53%)`,
				strokeOpacity: 1,
				strokeWeight: 2
			}
		case 'transport':
			return {
				strokeColor: 'rgba(96, 96, 96, 0.75)',
				strokeWeight: 0.5,
				strokeOpacity: 0,
				icons: [
					{
						icon: {
							path: 'M 0,-1 0,1',
							strokeOpacity: 0.5,
							scale: 2
						},
						offset: '0',
						repeat: '10px'
					}
				]
			}
	}
}

const polylinesFromRoute = (
	gmapsApi: GoogleMapsApi,
	route: Route,
	routeIndex: number = 0
) => {
	return route.paths.map(
		path =>
			new gmapsApi.Polyline({
				path: path.points
					.filter(
						(p: Point): p is CoordinateItem => p.type === 'coordinate'
					)
					.map(p => new gmapsApi.LatLng(p.latlng.lat, p.latlng.lng)),
				...getPolylinePropsForPathType(path.pathType, routeIndex)
			})
	)
}

const boundsFromPolylines = (
	gmapsApi: GoogleMapsApi,
	polylines: ReadonlyArray<google.maps.Polyline>
) => {
	const bounds = new gmapsApi.LatLngBounds()
	polylines.forEach(pl =>
		pl
			.getPath()
			.forEach(latlng =>
				bounds.extend(new gmapsApi.LatLng(latlng.lat(), latlng.lng()))
			)
	)

	return bounds
}

const MapContainer = styled.div`
	width: 100%;
	height: 100%;
	background-color: gray;
`

type GoogleMapsApi = typeof google.maps
type MapProps = {
	routes: ReadonlyArray<{ trip: Trip; route?: Route }>
	selectedTripShortName?: string
	changeSelectedTrip: (tripShortName?: string) => void
}

class Map extends React.Component<MapProps, {}> {
	private gmap?: google.maps.Map
	private gmapsApi?: GoogleMapsApi
	private polylinesByTripName: {
		[tripShortName: string]: ReadonlyArray<google.maps.Polyline>
	} = {}

	get polylines() {
		return R.flatten(R.values(this.polylinesByTripName))
	}

	isGmapsApiInitialized() {
		return Boolean(this.gmapsApi)
	}

	componentDidUpdate(prevProps: MapProps) {
		if (
			!R.equals(prevProps.routes, this.props.routes) &&
			this.isGmapsApiInitialized()
		) {
			this.updatePolylines()
		}

		if (
			!R.equals(
				prevProps.selectedTripShortName,
				this.props.selectedTripShortName
			)
		) {
			this.updateSelectedTrips()
		}
	}

	onGoogleApiLoaded(map: any, gmapsApi: any) {
		this.gmap = map
		this.gmapsApi = gmapsApi

		this.updatePolylines()
	}

	updatePolylines() {
		if (!this.gmap || !this.gmapsApi) {
			return
		}

		this.polylinesByTripName = this.props.routes
			.filter(r => r.route)
			.reduce((acc, cur, i) => {
				const polylines = polylinesFromRoute(this.gmapsApi!, cur.route!, i)
				acc[cur.trip.shortName] = polylines
				polylines.forEach(pl =>
					google.maps.event.addListener(pl, 'click', () =>
						this.props.changeSelectedTrip(cur.trip.shortName)
					)
				)
				return acc
			}, {})

		this.updateSelectedTrips()
		this.forceUpdate()
	}

	updateSelectedTrips() {
		const selectedPolylines = this.props.selectedTripShortName
			? this.polylinesByTripName[this.props.selectedTripShortName]
			: this.polylines

		this.polylines.forEach(pl => pl.setMap(null))
		selectedPolylines.forEach(pl => pl.setMap(this.gmap!))
		this.gmap!.fitBounds(
			boundsFromPolylines(this.gmapsApi!, selectedPolylines)
		)
	}

	render() {
		return (
			<>
				<MapContainer>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: 'AIzaSyD8wWPNJVCrVC8so3gXNy9GXX4DGBj_--I'
						}}
						defaultCenter={{ lat: 59.938043, lng: 30.337157 }}
						defaultZoom={5}
						options={{
							styles: gmapsStyle,
							mapTypeId:
								this.gmapsApi &&
								(this.gmapsApi.MapTypeId.TERRAIN as any)
						}}
						onGoogleApiLoaded={({ map, maps }) =>
							this.onGoogleApiLoaded(map, maps)
						}
						yesIWantToUseGoogleMapApiInternals
					/>
				</MapContainer>
			</>
		)
	}
}

export default Map

const gmapsStyle = [
	{
		featureType: 'all',
		elementType: 'geometry.fill',
		stylers: [
			{
				weight: '2.00'
			}
		]
	},
	{
		featureType: 'all',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#9c9c9c'
			}
		]
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.fill',
		stylers: [{ visibility: 'off' }]
	},
	{
		featureType: 'all',
		elementType: 'labels.text',
		stylers: [
			{
				visibility: 'simplified'
			},
			{
				color: '#777777'
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'all',
		stylers: [
			{
				color: '#f2f2f2'
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#ffffff'
			}
		]
	},
	{
		featureType: 'landscape.man_made',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#ffffff'
			}
		]
	},
	{
		featureType: 'poi',
		elementType: 'all',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'all',
		stylers: [
			{
				saturation: -100
			},
			{
				lightness: 45
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#eeeeee'
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#7b7b7b'
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'labels.text.stroke',
		stylers: [
			{
				color: '#ffffff'
			}
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'all',
		stylers: [
			{
				visibility: 'simplified'
			}
		]
	},
	{
		featureType: 'road.arterial',
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'transit',
		elementType: 'all',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'all',
		stylers: [
			{
				color: '#46bcec'
			},
			{
				visibility: 'on'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#c8d7d4'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#070707'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.stroke',
		stylers: [
			{
				color: '#ffffff'
			}
		]
	}
]
