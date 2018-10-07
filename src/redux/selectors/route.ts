import * as haversine from 'haversine'
import * as R from 'ramda'
import { createSelector } from 'reselect'

import { CoordinateItem, LatLng, Path, Route } from '../../maps'
import { RootState } from '../reducers'

export const combinedRoutesAndTripsSelector = createSelector(
	(state: RootState) => state.route.routesByTripShortName,
	(state: RootState) => state.trip.trips,
	(routesByTripShortName, trips) =>
		trips.map(trip => ({
			trip,
			route: routesByTripShortName[trip.shortName]
		}))
)

const latlngToExpanded = ({ lat, lng }: LatLng) => ({
	latitude: lat,
	longitude: lng
})

const pathLengthInKm = (path: Path) => {
	const coordinates = path.points.filter(
		(p): p is CoordinateItem => p.type === 'coordinate'
	)

	const coordinatePairs = R.aperture(2, coordinates)
	const distancesBetweenPairs = coordinatePairs.map(([a, b]) =>
		haversine(latlngToExpanded(a.latlng), latlngToExpanded(b.latlng))
	)

	return R.sum(distancesBetweenPairs)
}

const routeLengthInKm = (route: Route) => {
	return Math.round(
		R.sum(
			route.paths
				.filter(path => path.pathType === 'legit')
				.map(pathLengthInKm)
		)
	)
}

export const totalRouteLengthsInKm = createSelector(
	combinedRoutesAndTripsSelector,
	routesAndTrips =>
		R.sum(
			routesAndTrips
				.filter(({ route }) => Boolean(route))
				.map(({ route }) => routeLengthInKm(route))
		)
)
