/*
TODO: Allow custom styling of:
- The map itself (currently hardcoded to 'Desert'
- The cycle route/path
- The 'transport' route/path
*/

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

	var lines = pathTextFile.split('\n');
	var pointCount = parseInt(lines[0]);
	for(var i = 0; i < pointCount; i++) {
		var point = new google.maps.LatLng(lines[i * 2 + 1], lines[i * 2 + 2]);
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
		
		var onLoaded = function(gpxFile) {
			var waypoints = gpxFile.getElementsByTagName('wpt');			
			var names = gpxFile.getElementsByTagName('name');
	
			for(var i = 0; i < waypoints.length; i++) {
				var lat = waypoints[i].getAttribute('lat');
				var lon = waypoints[i].getAttribute('lon');
						
				var location = new google.maps.LatLng(lat, lon);
				var nightType = names[i].childNodes[0].nodeValue == "hostelli" ? NightType.Hotel : NightType.Tent;
		
				this.Nights.push(new Night(location, nightType));
			}
			
			isLoaded = true;
			callback();
		}.bind(this);
		
		LoadAsyncXML(nightsFile, onLoaded); // nightsXml is currently in GPX format
	};
};

function Route(cyclingPaths, transportPaths) {
	this.CyclingPaths = [];
	this.TransportPaths = [];
	
	var isLoaded = false;
	this.Load = function(callback) {
		if(isLoaded) {
			callback();
			return;
		}
		
		var remainingPathsToLoad = cyclingPaths.length + transportPaths.length;
		function onPathLoaded() {
			remainingPathsToLoad--;
			if(remainingPathsToLoad == 0) {
				isLoaded = true;
				callback();
			}
		};
	
		// load cycling paths
		for(var i = 0; i < cyclingPaths.length; i++) {
			var onGPXLoaded = function(gpxFile) {
				this.CyclingPaths.push(new Path(gpxFile));
				onPathLoaded();
			}.bind(this);
			
			LoadAsyncText(cyclingPaths[i], onGPXLoaded);
		}
		
		// load transport paths
		for(var i = 0; i < transportPaths.length; i++) {
		
			var onGPXLoaded = function(gpxFile) {
				this.TransportPaths.push(new Path(gpxFile));
				onPathLoaded();
			}.bind(this);
			
			LoadAsyncText(transportPaths[i], onGPXLoaded);
		}	
	};
}

function CycleMap(containerElement, mapProperties, route, nightCollection) {
	this.RouteLength = 0;
	this.NightCount = 0; nightCollection.Nights.length;
	
	// 
	var createIcon = function(url) {
		return {
			url: url,
			scaledSize: new google.maps.Size(14, 14),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(8,8)
		};
	}
		
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
	
	var tentIcon = createIcon("icons/tent.png");
	var hotelIcon = createIcon("icons/hotel.png");
	var routeBounds = new google.maps.LatLngBounds();
	
	var loadCallbacks = [];
	
	var routeLoaded = false;
	var nightsLoaded = false;
	var checkIsMapLoaded = function() {
		if(routeLoaded && nightsLoaded) {
			this.NightCount = nightCollection.Nights.length;
			
			for(var i = 0; i < loadCallbacks.length; i++) {
				loadCallbacks[i]();
			}
		}
	}.bind(this);
	
	this.WhenLoaded = function(callback) {
		if(routeLoaded && nightsLoaded) {
			callback();
		}
		else {
			loadCallbacks.push(callback);
		}
	};
	
	var onRouteLoaded = function () {
		// cycling paths
		for(var i = 0; i < route.CyclingPaths.length; i++) {
			var cyclingPath = route.CyclingPaths[i];
			routeBounds.union(cyclingPath.getBounds());
		
			var pathLine = new google.maps.Polyline({
				path: cyclingPath.Points,
				strokeColor: "rgb(96, 96, 192)",
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
				strokeColor:"#000000", 
				strokeWeight:0.5, 
				strokeOpacity:0, 
				icons: [{
					icon: lineSymbol,
					offset: '0',
					repeat: '10px'
				}],
						
				map: _googleMap
			});
		}
	
		_googleMap.fitBounds(routeBounds);
		routeLoaded = true;
		checkIsMapLoaded();
	}.bind(this);
	
	// load the route asynchronously
	route.Load(onRouteLoaded);

	var _nightMarkers = [];
	nightCollection.Load(onNightsLoaded);	
	function onNightsLoaded() {
		// nights
		for(var i = 0; i < nightCollection.Nights.length; i++) {
			var night = nightCollection.Nights[i];
		
			var marker = new google.maps.Marker({
				position: night.Location,
				icon: (night.NightType == NightType.Tent ? tentIcon : hotelIcon),
				map : isTouchDevice() ? _googleMap : null, // if using touch device, then markers should be visible.
			});
		
			_nightMarkers.push(marker);
		}
		
		nightsLoaded = true;
		checkIsMapLoaded();
	};
	
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
}

function isTouchDevice() {
	return 'ontouchstart' in window // works on most browsers
		|| 'onmsgesturechange' in window; // works on ie10
};

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
			"featureType":"water",
			"stylers": [{"visibility":"on"}, {"color":"#acbcc9"}]
		},	
		{
			"featureType":"landscape",
			"stylers":[{"color":"#f2e5d4"}]
		},
		{
			"featureType":"road.highway",
			"elementType":"geometry",
			"stylers":[{"color":"#c5c6c6"}]
		},
		{ 
			"featureType":"road.arterial",
			"elementType":"geometry",
			"stylers":[{"color":"#e4d7c6"}]
		},
		{
			"featureType":"road.local",
			"elementType":"geometry",
			"stylers":[{"color":"#fbfaf7"}]
		},
		{
			"featureType":"poi.park",
			"elementType":"geometry",
			"stylers":[{"color":"#c5dac6"}]
		},
		{
			"featureType":"administrative.province",
			"stylers":[{"visibility":"off"}],
		},
		{
			"featureType":"road",
			"stylers":[{"lightness": 18}]
		},
		{
			"featureType":"administrative.country",
			"elementType": "geometry.stroke",
			"stylers":[{"visibility":"on"}, {"lightness": 35}],
		},
		{
			// park labels are always off
			"featureType":"poi.park",
			"elementType": "labels",
			"stylers":[{"visibility":"off"}],
		},]),
};