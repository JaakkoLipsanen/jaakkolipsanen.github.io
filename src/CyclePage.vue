<template>
	<div id="content-div">
		<world-map></world-map>
		<route-selector></route-selector>
		<route-viewer v-show="isVisible"></route-viewer>
		<footer-bar></footer-bar>
	</div>
</template>

<script>
import WorldMap from "./WorldMap.vue";
import RouteSelector from "./RouteSelector.vue";
import RouteViewer from "./RouteViewer.vue";
import Footer from "./Footer.vue";

const data = {
	isVisible: false
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

	ready: () => {
		console.log("testi");
		setTimeout(() => { data.isVisible = true; }, 4000);
	},

	events: {
		"selected-changed": function(route) {
			this.$broadcast("selected-route-changed", route);
		}
	}
};
</script>

<style lang="sass" scoped>
	#content-div {
		text-align: center;
		display: block;
		margin: auto;

		width: auto;
		height: auto;

		margin-top: 36px;
		margin-bottom: 36px;
	}
</style>
