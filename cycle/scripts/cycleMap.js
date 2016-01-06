/*
TODO: Allow custom styling of:
- The map itself (currently hardcoded to 'Desert'
- The cycle route/path
- The 'transport' route/path
*/

function CreateGoogleIcon(url) {
	return {
		url: url,
		scaledSize: new google.maps.Size(6, 6),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(3,3)
	};
}

var MapType = {
	Normal: 0,
	Terrain: 1,
};

var LabelType = {
	Visible: 0,
	Hidden: 1,
};

function MapProperties(mapType, labelType) {
	this.MapType = mapType;
	this.LabelType = labelType;
	this.ShowStreetView = true;
	this.AutomaticallyFitOnResize = true;
}

// meh.. it would be nice if there was another constructor that accepted a LatLng[] ("points") ....
function Path(pathTextFile) { 
	this.Points = [];

	/* 
	
	Point format:
	- Line 1. lat
	- Line 2. lon
	
	Path  format
	- Line 1. Amount of points
	- Line 2-end. <amount of points> * Point format
	*/
	
	var lines = pathTextFile.split('\n');
	var pointCount = parseInt(lines[0]);
	for(var i = 0; i < pointCount; i++) {
		var lineNumber = i * 2 + 1; // + 1 because first line is amount of points
		var point = new google.maps.LatLng(lines[lineNumber], lines[lineNumber + 1]);
		this.Points.push(point); 
	}					
}

Path.prototype.getBounds = function() {
	var bounds = new google.maps.LatLngBounds();
	for(var i = 0; i < this.Points.length; i++) {
		bounds.extend(this.Points[i]);
	}
	
	return bounds;
}

var NightType = {
	Tent: 0,
	Hotel: 1,
};

function Night(location, nightType) {
	this.Location = location;
	this.NightType = nightType;
}

function NightCollection(nightsFile) {
	this.Nights = [];
	
	var isLoaded = false;
	this.Load = function(callback) {
		if(isLoaded) {
			callback();
			return;
		}

		function LoadNights(nightsFile, callback) {
			LoadAsyncXML(nightsFile, function (gpxFile) {
				var waypoints = gpxFile.getElementsByTagName('wpt');
				var names = gpxFile.getElementsByTagName('name');

				var nights = [];
				for (var i = 0; i < waypoints.length; i++) {
					var lat = waypoints[i].getAttribute('lat');
					var lon = waypoints[i].getAttribute('lon');

					var location = new google.maps.LatLng(lat, lon);
					var nightType = (names[i].childNodes[0].nodeValue == "hostelli") ? NightType.Hotel : NightType.Tent;

					nights.push(new Night(location, nightType));
				}

				callback(nights);
			});
		}

		LoadNights(nightsFile, function(nights) {
			this.Nights = nights;
			isLoaded = true;

			callback();
		}.bind(this));
	};
};

function RouteDescription(routeDescriptionFile) {
	this.CyclingPathFiles = [];
	this.TransportPathFiles = [];
	this.NightLocationsFile = "";

	var hasLoaded = false;
	this.Load = function(callback) {
		if(hasLoaded) {
			callback();
		}

		var routeDescriptionFolder = GetUriDirectory(routeDescriptionFile);
		var addFolderToPath = function(path) { return routeDescriptionFolder + path;}

		LoadAsyncText(routeDescriptionFile, function(text) {
			var lines = text.split("\n");
			this.CyclingPathFiles = lines[0].split(" ").map(addFolderToPath);
			this.TransportPathFiles = lines[1].split(" ").map(addFolderToPath);
			this.NightLocationsFile = addFolderToPath(lines[2]);

			hasLoaded = true;
			callback();
		}.bind(this));

	}
}

function Route(routeDescription) {
	this.CyclingPaths = [];
	this.TransportPaths = [];
	this.NightCollection = null;

	var hasLoaded = false;
	this.Load = function(callback) {
		if(hasLoaded) {
			callback();
			return;
		}

		function LoadPaths(pathFiles, callback) {
			if(pathFiles.length == 0) {
				callback([]);
			}

			var paths = [];
			var pathCount = pathFiles.length;
			function OnLoaded(path) {
				paths.push(new Path(path));

				pathCount--;
				if(pathCount == 0) {
					callback(paths);
				}
			}

			for(var i = 0; i < pathFiles.length; i++) {
				LoadAsyncText(pathFiles[i], OnLoaded);
			}
		}

		var cyclingPathsLoaded = false;
		var transportPathsLoaded = false;
		var nightCollectionLoaded = false;

		var checkIsAllLoaded = function() {
			if(cyclingPathsLoaded && transportPathsLoaded && nightCollectionLoaded) {
				callback();
			}
		}.bind(this);

		routeDescription.Load(function() {
			// load cycling paths
			LoadPaths(routeDescription.CyclingPathFiles, function(paths) {
				this.CyclingPaths = paths;

				cyclingPathsLoaded = true;
				checkIsAllLoaded();
			}.bind(this));

			// load transport paths
			LoadPaths(routeDescription.TransportPathFiles, function(paths) {
				this.TransportPaths = paths;

				transportPathsLoaded = true;
				checkIsAllLoaded();
			}.bind(this));

			// load night collection
			this.NightCollection = new NightCollection(routeDescription.NightLocationsFile);
			this.NightCollection.Load(function() {
				nightCollectionLoaded = true;
				checkIsAllLoaded();
			}.bind(this))

		}.bind(this));
	}.bind(this);
}

function CycleMap(containerElement, mapProperties, route) {
	this.RouteLength = 0;
	this.NightCount = 0;
		
	var googleMapsProperties = {
		panControl: false,
		mapTypeControl: false,
		zoomControl: false,
		
		streetViewControl: mapProperties.ShowStreetView,
		mapTypeId: (mapProperties.MapType == MapType.Terrain) ? google.maps.MapTypeId.TERRAIN : google.maps.MapTypeId.ROADMAP,
		
		// default values: if there is no route then these must be set
		zoom: 5,
		center: new google.maps.LatLng(48, 15), // middle of europe
		styles: (mapProperties.LabelType == LabelType.Visible) ? MapStyles.Desert.NormalStyle :  MapStyles.Desert.NoLabelStyle,
	};
	var _googleMap = new google.maps.Map(containerElement, googleMapsProperties);
	var routeBounds = new google.maps.LatLngBounds();

	var tentIcon = CreateGoogleIcon("icons/tent.png");
	var hotelIcon = CreateGoogleIcon("icons/hotel.png");
	
	var loadCallbacks = [];
	var _nightMarkers = [];

	var isLoaded = false;
	var onRouteLoaded = function () {
		// cycling paths
		for(var i = 0; i < route.CyclingPaths.length; i++) {
			var cyclingPath = route.CyclingPaths[i];
			routeBounds.union(cyclingPath.getBounds());
		
			var pathLine = new google.maps.Polyline({
				path: cyclingPath.Points,
				strokeColor: "rgb(96, 96, 124)",
				strokeOpacity: 1,
				strokeWeight: 1.5,
						
				map: _googleMap
			});
		
			this.RouteLength += Math.round(google.maps.geometry.spherical.computeLength(cyclingPath.Points) / 1000);
		}
	
		// transport paths
		for(var i = 0; i < route.TransportPaths.length; i++) {
			var transportPath = route.TransportPaths[i];

			var lineSymbol = {
				path: 'M 0,-1 0,1',
				strokeOpacity: 0.5,
				scale: 2
			};

			var pathLine = new google.maps.Polyline({
				path: transportPath.Points,
				strokeColor: "rgba(96, 96, 96, 0.75)",
				strokeWeight: 0.5,
				strokeOpacity: 0,
				icons: [{
					icon: lineSymbol,
					offset: '0',
					repeat: '10px'
				}],

				map: _googleMap
			});
		}

		// nights
		this.NightCount = route.NightCollection.Nights.length;
		for(var i = 0; i < route.NightCollection.Nights.length; i++) {
			var night = route.NightCollection.Nights[i];

			var marker = new google.maps.Marker({
				position: night.Location,
				icon: (night.NightType == NightType.Tent ? tentIcon : hotelIcon),
				map : IsTouchDevice() ? _googleMap : null, // if using touch device, then markers should be visible.
			});

			_nightMarkers.push(marker);
		}
	
		_googleMap.fitBounds(routeBounds);

		isLoaded = true;
		for(var i = 0; i < loadCallbacks.length; i++) {
			loadCallbacks[i]();
		}

	}.bind(this);
	
	// load the route asynchronously
	route.Load(onRouteLoaded);

	// show night markers when the cursor is over the container element
	containerElement.onmouseover = function() {
		for(var i = 0; i < _nightMarkers.length; i++) {
			_nightMarkers[i].setMap(_googleMap);
		}
	};
	
	// hide night markers when the cursor is over the container element
	containerElement.onmouseout = function() {
		for(var i = 0; i < _nightMarkers.length; i++) {
			_nightMarkers[i].setMap(null);
		}
	};
	
	if(mapProperties.AutomaticallyFitOnResize) {
		// when window is resized, re-center and re-zoom the map
		window.onresize = function(event) {	
			setTimeout(function() {
				_googleMap.fitBounds(routeBounds);
			}, 150);
		};
	}

	this.WhenLoaded = function(callback) {
		if(isLoaded) {
			callback();
		}
		else {
			loadCallbacks.push(callback);
		}
	};
}

function Style(styleArray) {
	this.NormalStyle = styleArray;
	
	this.NoLabelStyle = [];
	for(var i = 0; i < styleArray.length - 1; i++) {
		this.NoLabelStyle.push(styleArray[i]);
	}
	
	// set the last style-element (!! should always be "labels" !!) to hidden/off
	this.NoLabelStyle.push({
		"elementType": "labels",
		"stylers":[{"visibility":"off"}],
	});
}

// !! "elementType: labels" must be LAST ONE !!!
var MapStyles = {
	Desert: new Style([
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
	]),
};