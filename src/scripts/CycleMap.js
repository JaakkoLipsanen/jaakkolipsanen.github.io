"use strict";

import { LoadTextAsync, LoadXmlAsync, GetUriDirectory } from "./FileHelper.js";
import { WaitAll } from "./AsyncHelper.js";
import { IsTouchDevice, Assert } from "./MiscHelper.js";

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

class RouteView {
	constructor(route, useBigIcons, dayRange) {
		this.CyclingPathLines = []; // of type google.maps.Polyline
		this.TransportPathLines = []; // of type google.maps.Polyline
		this.NightMarkers = []; // of type google.maps.Marker

		this.Bounds = new google.maps.LatLngBounds();
		this.RouteLength = 0;

		this._initialize(route, useBigIcons, dayRange);
	}

	_initialize(route, useBigIcons, dayRange) {
		let routeData = null;
		if(dayRange === undefined) {
			routeData = route.CalculateRoute();
		}
		else {
			// dayRange variable contains the date range in a string ("33-39" for example)
			const dayStart = parseInt(dayRange.split("-")[0]);
			const dayEnd = parseInt(dayRange.split("-")[1]);

			routeData = route.CalculateRangedRoute(dayStart, dayEnd);
		}

		// cycling paths
		for(let cyclingPath of routeData.CyclingPaths) {
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
		for(let transportPath of routeData.TransportPaths) {
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
		this.NightCount = routeData.Nights.length;
		for(let night of routeData.Nights) {

			this.NightMarkers.push(new google.maps.Marker({
				position: night.Location,
				icon: (night.NightType == Night.Type.Tent ? (useBigIcons ? TentIconBig : TentIcon) : (useBigIcons ? HotelIconBig : HotelIcon)),
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

export class Route {
	constructor(data) {
		this._data = data;
	}

	CalculateRoute() {
		const cyclePaths = [];
		const transportPaths = [];
		const nights = [];

		let currentPathType = "cycle"; // cycle is default/initial path type
		let currentPath = [];
		for(let i = 0; i < this._data.length; i++) {
			const element = this._data[i];
			if(element.type === "night") {
				nights.push(element.night);
			}
			else if(element.type === "path-type-change") {
				if(element.pathType === currentPathType) {
					console.log("CycleMap route: path-type-change on route is the same type as before");
					continue;
				}

				if(currentPath.length == 0) {
					currentPathType = element.pathType;
					continue;
				}

				let destination = (currentPathType === "cycle") ? cyclePaths : transportPaths;
				destination.push(new Path(currentPath));
				currentPathType = element.pathType;

				// new array for the new path
				currentPath = [];
			}
			else if(element.type === "coordinate") {
				currentPath.push(element.location);
			}
		}

		// flush the last path into the paths
		if(currentPath.length > 0) {
			let destination = (currentPathType === "cycle") ? cyclePaths : transportPaths;
			destination.push(new Path(currentPath));
		}

		console.log(cyclePaths);
		return { CyclingPaths: cyclePaths, TransportPaths: transportPaths, Nights: nights };
	}

	CalculateRangedRoute(dayFirst, dayLast) {
		const cyclePaths = [];
		const transportPaths = [];
		const nights = [];

		let currentPathType = "cycle"; // cycle is default/initial path type
		let currentPath = [];

		let currentDay = 1;
		let startIndex = 0;
		for(; startIndex < this._data.length; startIndex++) {
			if(dayFirst <= currentDay) {
				break;
			}

			const element = this._data[startIndex];
			if(element.type === "night") {
				currentDay++;
			}
			else if(element.type == "path-type-change") {
				currentPathType = element.pathType;
			}
		}

		for(let i = startIndex; i < this._data.length; i++) {
			const element = this._data[i];
			if(element.type === "night") {
				nights.push(element.night);

				if(currentDay >= dayLast){
					break;
				}

				currentDay++;
			}
			else if(element.type === "path-type-change") {
				if(element.pathType === currentPathType) {
					console.log("CycleMap route: path-type-change on route is the same type as before");
					continue;
				}

				if(currentPath.length == 0) {
					currentPathType = element.pathType;
					continue;
				}

				let destination = (currentPathType === "cycle") ? cyclePaths : transportPaths;
				destination.push(new Path(currentPath));
				currentPathType = element.pathType;

				// new array for the new path
				currentPath = [];
			}
			else if(element.type === "coordinate") {
				currentPath.push(element.location);
			}
		}

		// flush the last path into the paths
		if(currentPath.length > 0) {
			let destination = (currentPathType === "cycle") ? cyclePaths : transportPaths;
			destination.push(new Path(currentPath));
		}

		console.log(cyclePaths);
		return { CyclingPaths: cyclePaths, TransportPaths: transportPaths, Nights: nights };
	}

	static async FromFile(filePath) {
		return new Promise(async (resolve, reject) => {
			try {
				const text = await LoadTextAsync(filePath);
				const lines = text.split('\n');

				// lines[0] is a comment. ignore it
				// the lines can contain either night ("n" + 't' or 'h' (tent or hotel)), coordinate (lat, lon eg "36.114,-115.17) or change in route type (eg "type transport" or "type cycle". default is cycle at the start)

				let data = [];
				let day = 1;
				let lastLocation = undefined;
				for(let i = 1; i < lines.length; i++) {
					const line = lines[i];
					if(line.trim().length == 0) {
						continue;
					}

					const parts = line.trim().split(" ");
					Assert(parts.length > 0);

					if(parts[0] == "n") { // night
						let nightType = (parts[1] === "h") ? Night.Type.Hotel : Night.Type.Tent;;

						Assert(lastLocation != undefined, "Error loading cycle route: 'lastLocation' is null. There is a night before the first coordinate");
						data.push({ type: "night", day: day, night: new Night(lastLocation, nightType) });
						day++;
					}
					else if(parts[0] == "t") { // "type". switches between cycle path and transport path. "t" == transport, "c" == cycle
						data.push({ type: "path-type-change", pathType: (parts[1] === "t") ? "transport" : "cycle"});
					}
					else if(parts.length == 2) { // if not "n" or "t", then it coordinate
						const point = new google.maps.LatLng(parts[0], parts[1]);
						data.push({ type: "coordinate", location: new google.maps.LatLng(parts[0], parts[1])});

						lastLocation = point;
					}
					else {
						console.log("ERROR: unknown line in cycle map route: '" + line + "'");
					}
				}

				resolve(new Route(data));
			}
			catch(err) { reject(err); }
		});
	}
}

export const MapStyle = {
	Dark: "dark",
	Light: "light"
}

export class CycleMap {
	constructor(container, mapStyle = MapStyle.Dark) {
		this.CurrentRouteView = null;
		this._isMouseOverMap = false;
		this._googleMap = null;
		this._isMouseOverMap = false;
		this._mapStyle = mapStyle;

		this._initializeMap(container);
	}

	get RouteLength() {
		return this.CurrentRouteView.RouteLength;
	}

	get NightCount() {
		return this.CurrentRouteView.NightCount;
	}

	get CurrentMapStyle() {
		return (this._mapStyle == MapStyle.Dark) ? MapStyles.Dark : MapStyles.Light;
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
			styles: this.CurrentMapStyle.NormalStyle,
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

		$(window).resize(() => {
			this.OnSizeChanged();
		});
	}

	async SetRoute(routeItem, dayRange) {
		const routeView = routeItem.routeView || (routeItem.routeView = new RouteView(await Route.FromFile(routeItem.routePath), this.CurrentMapStyle.UseBigIcons, dayRange));

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


function CreateGoogleIcon(url, size = 6) {
	return {
		url: url,
		scaledSize: new google.maps.Size(size, size),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(size / 2, size / 2)
	};
}

const TentIcon = CreateGoogleIcon("/assets/icons/tent.png");
const HotelIcon = CreateGoogleIcon("/assets/icons/hotel.png");

const TentIconBig = CreateGoogleIcon("/assets/icons/tent_outlined.png", 8);
const HotelIconBig = CreateGoogleIcon("/assets/icons/hotel_outlined.png", 8);

class Style {
	constructor(styleArray, bigIcons = false) {
		this.NormalStyle = styleArray;
		this.UseBigIcons = bigIcons;

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
		{"featureType":"administrative.country", "elementType": "geometry.stroke", "stylers":[{"lightness": "20"}]},

		{"featureType":"poi","stylers":[{"visibility":"simplified"}]},
		{"featureType":"road","stylers":[{"visibility":"simplified"}]},
		{"featureType":"transit","stylers":[{"visibility":"simplified"}]},
		{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},
		{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},
		{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}, { "lightness": "40" }]}, // "color": "#FF7F50"}]},
		{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"}, { "lightness": "25" }]}, // "color": "#FF7F50"}]},
		{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"}, { "lightness": "-3" }]}, // "color": "#FF7F50"}]},
		{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"on"}, { "lightness": "-5" }]}, // "color": "#FF7F50"}]},
		{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},
		{"stylers":[{"saturation":-77}]},{"featureType":"road"},
		{
			"featureType": "road",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				},
			]
		},
		{"featureType":"water", "elementType": "geometry.fill", "stylers":[{"visibility":"on"}, { "lightness": -6}]},
		{"featureType":"water", "elementType": "labels", "stylers":[{"visibility":"off"}]},

		], true),


	Dark: new Style([

		{"featureType":"administrative.province", "elementType": "geometry", "stylers":[{"visibility":"on"}]},
		{"featureType":"administrative.country", "elementType": "geometry", "stylers":[{"visibility":"on"}]},

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
					"visibility": "on"
				},
				{
					"color": "#333333"
				}
			]
		},

		{
			"featureType": "road",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				},
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
					"lightness": 26
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
					   "color": "#363636"
				   },
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
					"lightness": 20
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
					"lightness": 25
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
					"lightness": 22
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
					"lightness": 26
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
