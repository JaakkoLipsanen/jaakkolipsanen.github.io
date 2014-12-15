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
}

// meh.. it would be nice if there was another constructor that accepted a LatLng[] ("points") ....
function Path(gpxFile) { 
	this.Points = [];

	var xmlDoc = loadXML(gpxFile);
	var trackPoints = xmlDoc.getElementsByTagName('trkpt');
	
	for(var i = 0; i < trackPoints.length; i++) {
		var lat = trackPoints[i].getAttribute('lat');
		var lon = trackPoints[i].getAttribute('lon');
						
		var point = new google.maps.LatLng(lat, lon);
		this.Points.push(point);
	}					
}

var NightType = {
	Tent: 0,
	Hotel: 1,
};

function Night(location, nightType) {
	this.Location = location;
	this.NightType = nightType;
}

function NightCollection(nightsXml) {
	this.Nights = [];
	if(nightsXml == null) 
	{ 
		return; 
	}
	
	var xmlDoc = loadXML(nightsXml); // nightsXml is currently in GPX format
	
	var waypoints = xmlDoc.getElementsByTagName('wpt');			
	var names = xmlDoc.getElementsByTagName('name');
	
	for(var i = 0; i < waypoints.length; i++) {
		var lat = waypoints[i].getAttribute('lat');
		var lon = waypoints[i].getAttribute('lon');
						
		var location = new google.maps.LatLng(lat, lon);
		var nightType = names[i].childNodes[0].nodeValue == "hostelli" ? NightType.Hotel : NightType.Tent;
		
		this.Nights.push(new Night(location, nightType));
	}
};

Path.prototype.getBounds = function() {
	var bounds = new google.maps.LatLngBounds();
	for(var i = 0; i < this.Points.length; i++) {
		bounds.extend(this.Points[i]);
	}
	
	return bounds;
}

function Route(cyclingPaths, transportPaths) {
	this.CyclingPaths = cyclingPaths;
	this.TransportPaths = transportPaths; // boat/train/plane paths
}

function CycleMap(containerElement, mapProperties, route, nightCollection) {
	this.RouteLength = 0;
	this.NightCount = nightCollection.Nights.length;
	
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
	
	this._googleMap = new google.maps.Map(containerElement, googleMapsProperties);
	
	var tentIcon = createIcon("icons/tent.png");
	var hotelIcon = createIcon("icons/hotel.png");
	var routeBounds = new google.maps.LatLngBounds();
	
	// cycling paths
	for(var i = 0; i < route.CyclingPaths.length; i++) {
		var cyclingPath = route.CyclingPaths[i];
		routeBounds.union(cyclingPath.getBounds());
		
		var pathLine = new google.maps.Polyline({
			path: cyclingPath.Points,
			strokeColor: "rgb(96, 96, 192)",
			strokeOpacity: 1,
			strokeWeight: 1.5,
						
			map: this._googleMap
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
						
			map: this._googleMap
		});
	}
	
	this._googleMap.fitBounds(routeBounds);

	// nights
	this._nightMarkers = [];
	for(var i = 0; i < nightCollection.Nights.length; i++) {
		var night = nightCollection.Nights[i];
		
		var marker = new google.maps.Marker({
			position: night.Location,
			icon: (night.NightType == NightType.Tent ? tentIcon : hotelIcon),
			map : isTouchDevice() ? this._googleMap : null, // null by default. nights are shown when mouse is over the container element
		});
		
		this._nightMarkers.push(marker);
	}
	
	/* TODO: this obviously doesnt work on mobile/touch interfaces */
	
	// show night markers when the cursor is over the container element
	containerElement.onmouseover = function() {
		for(var i = 0; i < this._nightMarkers.length; i++) {
			this._nightMarkers[i].setMap(this._googleMap);
		}
	}.bind(this);
	
	// hide night markers when the cursor is over the container element
	containerElement.onmouseout = function() {
		for(var i = 0; i < this._nightMarkers.length; i++) {
			this._nightMarkers[i].setMap(null);
		}
	}.bind(this);
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