"use strict";

// import GoogleMapsHelper from "./GoogleMapsHelper.js";

export class RouteDescription {
	constructor(x) { }
}

export class RouteView {
	constructor(x) { }
}
export class Route {
	constructor(x) { }
}

/* Mieti täs et voisko ton google mapsin importtaa ihan vaan globaalisti html:ssä? ois aika helppoa.. */
export class CycleMap {
	constructor(route, mapProperties) {
		this.CurrentRoute = route;
	/*	GoogleMapsHelper.load(() => {
			_initializeMap(mapProperties);
		}); */
	}

	get RouteLength() {
		return this.Route.RouteLength;
	}

	get RouteLength() {
		return this.Route.NightCount;
	}

	_initializeMap(mapProperties) {
		/* const googleMapsProperties = {
			panControl: false,
			mapTypeControl: false,
			zoomControl: false,

			streetViewControl: mapProperties.ShowStreetView,
			mapTypeId: google.maps.MapTypeId.ROADMAP,

			// default values: if there is no route then these must be set
			zoom: 5,
			center: new google.maps.LatLng(48, 15), // middle of europe
			styles: MapStyles.Desert.NormalStyle,
			backgroundColor: "rgb(43, 43, 43)" // same color as the ocean in the map style
		}; */
	}
}
