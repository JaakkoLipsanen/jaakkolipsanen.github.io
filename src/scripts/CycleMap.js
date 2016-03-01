"use strict";
/*global google */

import { LoadTextAsync, LoadXmlAsync, GetUriDirectory } from "./FileHelper.js";
import { WaitAll } from "./AsyncHelper.js";
import { IsTouchDevice } from "./MiscHelper.js";

class Path {
	constructor(points) {
		this.Points = points;
	}

	GetBounds() {
		const bounds = new google.maps.LatLngBounds();
		for(let i = 0; i < this.Points.length; i++) {
			bounds.extend(this.Points[i]);
		}

		return bounds;
	}

	static async FromTextFile(textFilePath) {
		return new Promise(async (resolve, reject) => {
			try {
				const text = await LoadTextAsync(textFilePath);
				const lines = text.split('\n');
				const pointCount = parseInt(lines[0]);

				let points = [];
				for(let i = 0; i < pointCount; i++) {
					const lineNumber = i * 2 + 1; // + 1 because first line is amount of points
					const point = new google.maps.LatLng(lines[lineNumber], lines[lineNumber + 1]);
					points.push(point);
				}

				resolve(new Path(points));
			}
			catch(err) { reject(err); }
		});
	}
}

class Night {
	constructor(location, type) {
		this.Location = location;
		this.NightType = type;
	}

	static get Type() {
		return {
			Tent: 0,
			Hotel: 1,
		};
	}
}

class NightCollection {
	constructor(nights) {
		this.Nights = nights;
	}

	static async FromFile(filePath) {
		return new Promise(async (resolve, reject) => {
			try {
				const gpx = await LoadXmlAsync(filePath);
				const waypoints = gpx.getElementsByTagName('wpt');
				const names = gpx.getElementsByTagName('name');

				let nights = [];
				for (let i = 0; i < waypoints.length; i++) {
					const lat = waypoints[i].getAttribute('lat');
					const lon = waypoints[i].getAttribute('lon');

					const location = new google.maps.LatLng(lat, lon);
					const nightType = (names[i].childNodes[0].nodeValue == "hostelli") ? Night.Type.Hotel : Night.Type.Tent;

					nights.push(new Night(location, nightType));
				}

				resolve(new NightCollection(nights));
			}
			catch(err) { reject(err); }
		});
	}
}

class RouteView {
	constructor(route) {
		this.CyclingPathLines = []; // of type google.maps.Polyline
		this.TransportPathLines = []; // of type google.maps.Polyline
		this.NightMarkers = []; // of type google.maps.Marker

		this.Bounds = new google.maps.LatLngBounds();
		this.RouteLength = 0;

		this._initialize(route);
	}

	_initialize(route) {
		// cycling paths
		for(let cyclingPath of route.CyclingPaths) {
			this.Bounds.union(cyclingPath.GetBounds());

			this.CyclingPathLines.push(new google.maps.Polyline({
				path: cyclingPath.Points,
				strokeColor: "rgb(96, 96, 124)",
				strokeOpacity: 1,
				strokeWeight: 1.5,

				map: null
			}));

			this.RouteLength += Math.round(google.maps.geometry.spherical.computeLength(cyclingPath.Points) / 1000);
		}

		// transport paths
		for(let transportPath of route.TransportPaths) {
			const lineSymbol = {
				path: 'M 0,-1 0,1',
				strokeOpacity: 0.5,
				scale: 2
			};

			this.TransportPathLines.push(new google.maps.Polyline({
				path: transportPath.Points,
				strokeColor: "rgba(96, 96, 96, 0.75)",
				strokeWeight: 0.5,
				strokeOpacity: 0,
				icons: [{
					icon: lineSymbol,
					offset: '0',
					repeat: '10px'
				}],

				map: null
			}));
		}

		// nights
		this.NightCount = route.NightCollection.Nights.length;
		for(let night of route.NightCollection.Nights) {

			this.NightMarkers.push(new google.maps.Marker({
				position: night.Location,
				icon: (night.NightType == Night.Type.Tent ? TentIcon : HotelIcon),
				map : null,
			}));
		}
	}

	AssignMap(gmap, showNightMarkers) {
		for(let pathLine of this.CyclingPathLines) {
			pathLine.setMap(gmap);
		}

		for(let pathLine of this.TransportPathLines) {
			pathLine.setMap(gmap);
		}

		for(let nightMarker of this.NightMarkers) {
			nightMarker.setMap(showNightMarkers ? gmap : null);
		}

		if(gmap != null) {
			gmap.fitBounds(this.Bounds);
		}
	}
}

class Route {
	constructor(cyclingPaths, transportPaths, nightCollection) {
		this.CyclingPaths = cyclingPaths;
		this.TransportPaths = transportPaths;
		this.NightCollection = nightCollection;
	}

	static async FromFile(filePath) {
		return new Promise(async (resolve, reject) => {
			try {
				const text = await LoadTextAsync(filePath);
				const lines = text.split('\n');

				const LoadPaths = async (pathFiles) => {
					return new Promise(async function(resolve, reject) {
						try {
							var paths = await WaitAll(pathFiles, async (path) => await Path.FromTextFile(path));
							resolve(paths);
						}
						catch(err) { reject(err); }
					});
				};

				var routeDescriptionFolder = GetUriDirectory(filePath);
				const addFolderToPathFunc = function(path) { return routeDescriptionFolder + path;}

				// TODO: atm everything is loaded sequentally !! Bad !!
				const cyclingPathFiles = lines[0].split(" ").map(addFolderToPathFunc);
				const cyclingPaths = await LoadPaths(cyclingPathFiles);

				const transportPathFiles = lines[1].split(" ").map(addFolderToPathFunc);
				const transportPaths = await LoadPaths(transportPathFiles);

				const nightLocationsFile = addFolderToPathFunc(lines[2]);
				const nightCollection = await NightCollection.FromFile(nightLocationsFile);

				resolve(new Route(cyclingPaths, transportPaths, nightCollection));
			}
			catch(err) { reject(err); }
		});
	}
}

export class CycleMap {
	constructor(container) {
		this.CurrentRouteView = null;
		this._isMouseOverMap = false;
		this._googleMap = null;
		this._isMouseOverMap = false;

		this._initializeMap(container);
	}

	get RouteLength() {
		return this.CurrentRouteView.RouteLength;
	}

	get NightCount() {
		return this.CurrentRouteView.NightCount;
	}

	_initializeMap(container) {
		let googleMapsProperties = {
			panControl: false,
			mapTypeControl: false,
			zoomControl: true,

			scrollwheel: false,
			navigationControl: true,
			scaleControl: false,
			draggable: true,

			streetViewControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,

			// default values: if there is no route then these must be set
			zoom: 5,
			center: new google.maps.LatLng(48, 15), // middle of europe
			styles: MapStyles.Light.NormalStyle,
			backgroundColor: "rgb(43, 43, 43)", // same color as the ocean in the map style


		};

		this._googleMap = new google.maps.Map(container, googleMapsProperties);

		let streetViewChangedListeners = [];
		google.maps.event.addListener(this._googleMap.getStreetView(), 'visible_changed', () => {
			const isVisible = this._googleMap.getStreetView().getVisible();
			for(let listener of streetViewChangedListeners) {
				listener(isVisible);
			}
		});

		this.OnStreetviewVisibileChanged = function(callback) {
			streetViewChangedListeners.push(callback);
		};

		const setNightMarkerVisibility = (markers, visible) => {
			for(let nightMarker of markers) {
				nightMarker.setMap(visible ? this._googleMap : null);
			}
		};

		// show night markers when the cursor is over the container element
		$(container).mouseover(() => {
			this._isMouseOverMap = true;
			if(this.CurrentRouteView == null) return;

			setNightMarkerVisibility(this.CurrentRouteView.NightMarkers, true);
		});

		// hide night markers when the cursor is over the container element
		$(container).mouseout(() => {
			this._isMouseOverMap = false;
			if(this.CurrentRouteView == null) return;

			setNightMarkerVisibility(this.CurrentRouteView.NightMarkers, false);
		});

	}

	async SetRoute(routeItem) {
		const routeView = routeItem.routeView || (routeItem.routeView = new RouteView(await Route.FromFile(routeItem.routePath)));

		if(this.CurrentRouteView != null) {
			this.CurrentRouteView.AssignMap(null);
		}

		routeView.AssignMap(this._googleMap, IsTouchDevice() || this._isMouseOverMap);
		this.CurrentRouteView = routeView;
		this.OnSizeChanged();
	}

	async PreloadRoutes(routes) {
		for(let routeItem of routes) {
			if(routeItem.routeView == null) {
				routeItem.routeView = new RouteView(await Route.FromFile(routeItem.route));
			}
		}
	}

	OnSizeChanged() {
		if(this.CurrentRouteView != null) {
			google.maps.event.addListenerOnce(this._googleMap, 'resize', () => {
				this._googleMap.fitBounds(this.CurrentRouteView.Bounds);
			});

			google.maps.event.trigger(this._googleMap, 'resize');
		}
	}
}


function CreateGoogleIcon(url) {
	return {
		url: url,
		scaledSize: new google.maps.Size(6, 6),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(3,3)
	};
}

const TentIcon = CreateGoogleIcon("assets/icons/tent.png");
const HotelIcon = CreateGoogleIcon("assets/icons/hotel.png");

class Style {
	constructor(styleArray) {
		this.NormalStyle = styleArray;

		this.NoLabelStyle = [];
		for(let i = 0; i < styleArray.length - 1; i++) {
			this.NoLabelStyle.push(styleArray[i]);
		}

		// set the last style-element (!! should always be "labels" !!) to hidden/off
		this.NoLabelStyle.push({
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		});
	}
}

// !! "elementType: labels" must be LAST ONE !!!
const MapStyles = {
	Light: new Style([
		{"featureType":"administrative","stylers":[{"visibility":"off"}]},
		{"featureType":"administrative.locality","stylers":[{"visibility":"on"}]},
		{"featureType":"administrative.province", "elementType": "geometry", "stylers":[{"visibility":"on"}]},
		{"featureType":"administrative.country", "elementType": "geometry", "stylers":[{"visibility":"on"}]},

		{"featureType":"poi","stylers":[{"visibility":"simplified"}]},
		{"featureType":"road","stylers":[{"visibility":"simplified"}]},
		{"featureType":"water","stylers":[{"visibility":"simplified"}]},
		{"featureType":"transit","stylers":[{"visibility":"simplified"}]},
		{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},
		{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},
		{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},
		{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},
		{"stylers":[{"saturation":-77}]},{"featureType":"road"}]),

	Dark: new Style([
		{
			"featureType": "all",
			"elementType": "labels.text.fill",
			"stylers": [
				{
					"saturation": 36
				},
				{
					"color": "#000000"
				},
				{
					"lightness": 40
				}
			]
		},
		{
			"featureType": "all",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"visibility": "on"
				},
				{
					"color": "#000000"
				},
				{
					"lightness": 16
				}
			]
		},
		{
			"featureType": "all",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 20
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 17
				},
				{
					"weight": 1.2
				}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 20
				}
			]
		},
		{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 21
				}
			]
		},
		{
		   "featureType": "poi.park",
		   "elementType": "geometry.fill",
		   "stylers": [
				   {
					   "color": "#373737"
				   }
		   		]
		   },
		{
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 17
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 29
				},
				{
					"weight": 0.2
				}
			]
		},
		{
			"featureType": "road.arterial",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 18
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 16
				}
			]
		},
		{
			"featureType": "transit",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 19
				}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
				{
					"color": "#000000"
				},
				{
					"lightness": 17
				}
			]
		}
	])
};
