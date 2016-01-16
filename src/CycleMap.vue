<template>
	<div id="cycle-map-container">
		<div style='position: relative; z-index: 10000;'>
			<img class='resize-button fullscreen-button' src='../assets/icons/expand.png'  v-on:click='enterFullscreen'  />
		</div>

		<div style='width: 100%; height: 100%' id='cycle-map' ></div>

		<!-- Bottom text -->
		<p style=' margin-top: 0px; float: left;'>{{ this.map.RouteLength + 'km, ' + this.map.NightCount +  ' days' }}</p>
		<div style='display: inline; float: right'>
			<img style='width: 10px; display: inline' src='../assets/icons/tent.png'><p style='display: inline'> camping </p>
			<img style='margin-left: 4px; width: 10px; display: inline' src='../assets/icons/hotel.png'><p style='display: inline'> hotel</p>
		</div>
	</div>,
</template>

<script>
import { CycleMap } from "./scripts/CycleMap.js";
import { ExitFullScreen, EnterFullScreen, OnFullscreenChange } from "./scripts/MiscHelper.js";

export default {
	props: {
		route: Object // route is the *item* of the route (so it contains 'text', description, route file path etc)
	},
	watch: {
		"route": function(value, oldValue) {
			this.map.SetRoute(value);
		}
	},

	data() {
		return {
			map: null,
			isMapFullscreen: false
		};
	},

	ready: function() {
		this.map = new CycleMap($("#cycle-map").get(0));

		if(this.routeView != null) {
			this.map.SetRoute(this.routeView);
		}

		OnFullscreenChange(() => {
			this.isMapFullscreen = !this.isMapFullscreen;
			$("#cycle-map-container").toggleClass("fullscreen", this.isMapFullscreen);
			$("#cycle-map-container .fullscreen-button").attr("src", this.isMapFullscreen ? "../assets/icons/reduce.png" : "../assets/icons/expand.png");

			this.map.OnSizeChanged();
		});

		this.map.OnStreetviewVisibileChanged((isVisible) => {
			// fullscreen button should only show when street view is NOT visible!
			$("#cycle-map-container .fullscreen-button").toggle(!isVisible);

			// without this, is user enters fullscreen in street view, it will mess everything :/
			if(this.isMapFullscreen) {
				ExitFullScreen();
			}
		});
	},

	methods: {
		enterFullscreen: function(event) {
			if(this.isMapFullscreen) {
				ExitFullScreen();
			}
			else {
				EnterFullScreen($("#cycle-map-container").get(0));
			}
		}
	},

	events: {
		"routes-loaded": function(routes) {
			this.map.PreloadRoutes(routes);
		}
	}
};
</script>

<style lang=sass>
	#cycle-map-container {
		width: 500px;
		height: 500px;
		margin: auto;

		color: white;
	}

	.fullscreen-button {
		width: 20px;
		position: absolute;
		top: 8px;
		right: 8px;
		opacity: 0.5
	}

	.fullscreen-button:hover {
		transform: scale(1.2, 1.2);
		opacity: 1 !important;
		cursor: pointer;
	}

	.fullscreen {
		width: 100% !important;
		height: 100% !important;
	}

	// remove Google logo, copyright print etc from Google Maps. Not allowed but.. blargh
	.gmnoprint a, .gmnoprint span, .gm-style-cc { display: none; }
	.gmnoprint div { background:none !important; }
	a[href^='http://maps.google.com/maps']{display:none !important}
	a[href^='https://maps.google.com/maps']{display:none !important}
</style>
