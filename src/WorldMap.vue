<template>
	<div id="map-divider">
		<img id="map-img" src="/assets/images/cycle/WorldMap.png">
		<canvas id="route-canvas" style=""></canvas>
	</div>
</template>

<script>

export default {
	data() {
		return {
		};
	}
};
</script>

<style lang="sass" scoped>
	#map-img {
		max-width:100%;
		max-height: 70vh;
		position: relative;
		left: 0px;
		top: 0px;
		margin: 0;
		padding: 0;
	}

	#route-canvas {
		position: absolute;
		left: 0px;
		right: 0px;
		top: 0px;
		margin-left: auto;
		margin-right: auto;
		padding: 0;
	}
</style>
