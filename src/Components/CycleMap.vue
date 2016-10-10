<template>
	<div class="cycle-map-and-info-container">
		<div class="cycle-map-container" v-el:cycle-map-container>

			<div style='position: relative; z-index: 1;'>
				<div class="fullscreen-button-container" v-on:click='enterFullscreen'>
					<img class='resize-button fullscreen-button' :src="isMapFullscreen ? '/icons/reduce.png' : '/icons/expand.png'" v-el:fullscreen-button>
				</div>
			</div>

			<div style='width: 100%; height: 100%' class='cycle-map' v-el:cycle-map></div>

		</div>

		<!-- Bottom text -->
		<p v-if="map && map.IsRouteLoaded" class="map-length-and-night-count-text" style=' margin-top: 0px; margin-left: 1px; float: left;'>{{ map.RouteLength + 'km, ' + map.NightCount +  ' days' }}</p>
		<div style='display: inline; float: right; margin-right: 2px'>
			<img style='width: 10px; display: inline' src='/icons/tent.png'><p style='display: inline; margin-left: 4px;'>camping </p>
			<img style='margin-left: 4px; width: 10px; display: inline' src='/icons/hotel.png'><p style='display: inline; margin-left: 4px;'>hotel</p>
		</div>
	</div>
</template>

<script>
import { CycleMap } from "../scripts/CycleMap.js";
import { ExitFullScreen, EnterFullScreen, OnFullscreenChange } from "../scripts/MiscHelper.js";

export default {
	props: {
		routePath: String,
		dayRange: Object,
		theme: {
			type: String,
			default: "dark"
		},

		/* doesn't support changing after initalization */
		forceNightMarkersVisible: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		"routePath": function(value, oldValue) {
			if(!(value in this.routes)) {
				this.routes[value] = { routePath: value };
			}

			this.setRoute(this.routes[value], this.dayRange);
		},

		"dayRange": function(value, oldValue) {
			this.setRoute(this.routes[this.routePath], this.dayRange);
		}
	},

	data() {
		return {
			map: null,
			isMapFullscreen: false,
			routes: { }
		};
	},

	ready: function() {
		this.map = new CycleMap(this.$els.cycleMap, this.theme, { alwaysShowNightMarkers: this.forceNightMarkersVisible });
		if(this.routePath != null) {
			this.routes[this.routePath] = { routePath: this.routePath };
			this.setRoute(this.routes[this.routePath], this.dayRange); // await this.map.SetRoute(this.routes[this.routePath], this.dayRange);

		}

		OnFullscreenChange(() => {
			this.isMapFullscreen = !this.isMapFullscreen;
			$(this.$els.cycleMap).toggleClass("fullscreen", this.isMapFullscreen);

			this.map.OnSizeChanged();
		});

		this.map.OnStreetviewVisibileChanged((isVisible) => {
			// fullscreen button should only show when street view is NOT visible!
			$(this.$els.fullScreenButton).toggle(!isVisible);

			// without this, is user enters fullscreen in street view, it will mess everything :/
			if(this.isMapFullscreen) {
				ExitFullScreen();
			}
		});
	},

	methods: {
		setRoute: async function(route, dayRange) {
			await this.map.SetRoute(route, dayRange);
			this.$dispatch("map-loaded", this.map);
		},

		enterFullscreen: function(event) {
			if(this.isMapFullscreen) {
				ExitFullScreen();
			}
			else {
				EnterFullScreen(this.$els.cycleMapContainer);
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

<style lang="sass" scoped>
	.cycle-map-container {
		width: 100%;
		height: 100%;
		margin: auto;


		color: white;
	}

	$default-map-size: 500px;
	.cycle-map-and-info-container {
		width: $default-map-size;
		height: $default-map-size;

		/* this is for the bottom text (days, kilmoeters and hotel/tent legend) since they are not calculated in the layout */
		margin-bottom: 24px;
	}

	.fullscreen-button-container {
		position: absolute;
		top: 8px;
		right: 8px;
		background-color: white;
		border-radius: 2px;
		text-align: center;

		/* from gmaps zoom/streetview buttons */
		box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px;

		width: 28px;
		height: 28px;
		cursor: pointer;
	}

	.fullscreen-button {
		width: 16px;
		height: 16px;

		margin-top: 6px;
		display: inline-block;
		opacity: 0.65;
	}

	.fullscreen-button-container:hover > img {
		transform: scale(1.1, 1.1);
		opacity: 0.8 !important;
	}

	.fullscreen {
		width: 100% !important;
		height: 100% !important;
	}

</style>

<style lang="sass">
	// remove Google logo, copyright print etc from Google Maps. Not allowed but.. blargh
	.gmnoprint a, .gmnoprint span, .gm-style-cc { display: none; }
//	.gmnoprint div { background:none !important; }
	.cycle-map-container a[href^='http://maps.google.com/maps']{display:none !important}
	.cycle-map-container a[href^='https://maps.google.com/maps']{display:none !important}
</style>
