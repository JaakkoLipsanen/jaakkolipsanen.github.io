<template>
	<div id="content-div">
		<world-map></world-map>
		<route-selector :items="items"></route-selector>
		<route-viewer></route-viewer>
		<footer-bar></footer-bar>
	</div>
</template>

<script>
import WorldMap from "./WorldMap.vue";
import RouteSelector from "./RouteSelector.vue";
import RouteViewer from "./RouteViewer.vue";
import Footer from "./Footer.vue";

const data = {
	isVisible: false,
	items: [
		{
			name: "Northern Europe",
			year: 2014,
			text: "Yay my first tour it was nice Sweden-Belgium!",
			route: "data/cycle/europe14/route-description.txt"
			// gallery: new GallerySource("Europe '14", "data/cycle/europe14/photos")
		},
		{
			name: "Spain",
			year: 2014,
			text: "Wooo very freezing trip! Also super pretty!",
			route: "data/cycle/spain14/route-description.txt"
			// gallery: new GallerySource("Spain '14", "data/cycle/spain14/photos")
		},
		{
			name: "Central Europe", year: 2015,
			text: "Woo Alps and Pyreenes!",
			route: "data/cycle/europe15/route-description.txt"
			// gallery: new GallerySource("Europe '15", "data/cycle/europe15/photos")
		}]
};

export default {
	data() {
		return data;
	},
	components: {
		"world-map": WorldMap,
		"route-selector": RouteSelector,
		"route-viewer": RouteViewer,
		"footer-bar": Footer
	},

	events: {
		"selected-changed": function(route) {
			this.$broadcast("selected-route-changed", route);
		}
	},

	ready: function() {
		this.$broadcast("routes-loaded", this.items);
	}
};
</script>

<style lang="sass">
	$default-text-color: rgb(144, 144, 144);
	$default-font-size: 18px;

	#content-div {
		text-align: center;
		display: block;
		margin: auto;

		width: auto;
		height: auto;

		margin-top: 36px;
		margin-bottom: 36px;
	}

	p {
		color: $default-text-color;
		font-size: $default-font-size;
	}
</style>
