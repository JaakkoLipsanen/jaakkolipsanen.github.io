<template>
	<div id="map-divider" style="max-width: 1600px; width: 90%; max-height: 70vh; position: relative; display: inline-block; margin: 0px; padding: 0px; text-align: center;">
		<img id="map-img" src="/assets/images/cycle/WorldMap.png" style="max-width:100%; max-height: 70vh; position: relative; left: 0px; top: 0px; margin: 0; padding: 0;">
		<canvas id="route-canvas" style="position: absolute; left: 0px; right: 0px; top: 0px; margin-left: auto;  margin-right: auto; padding: 0;"></canvas>
	</div>
</template>

<script>

import { Route } from "../scripts/CycleMap.js";
export default {
	data() {
		return {
		};
	},

	ready: async function() {


		const europe14 = await Route.FromFile("/cycle/europe14/route/route-description.txt"); // (["data/europe14/cycle-sweden-norway.path", "data/europe14/cycle-denmark-belgium.path"], ["data/europe14/boat-finland-sweden.path", "data/europe14/boat-norway-denmark.path"]);
		const spain14 =  await Route.FromFile("/cycle/spain14/route/route-description.txt");
		const europe15 =  await Route.FromFile("/cycle/europe15/route/route-description.txt");

		const paintRoute = function (context, route) {
			var mapWidth = context.canvas.width;
			var mapHeight = context.canvas.height;
			var lonToX = function (longitude) {
				// häx!! for some reason, longitude > 0 works pretty much perfectly, but with negative values it doesn't work properly (some values are correct, some are bit wrong)
				if (longitude > 0)
					return mapWidth / 2 + (longitude / 180 * (mapWidth / 2)) * 0.946;
				else {
					return mapWidth / 2 + (longitude / 187.480162 * (mapWidth / 2));
				}
			}
			const latToY = function (latitude) {
				var latRad = latitude * Math.PI / 180;
				var mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
				return mapHeight * 0.65131894484 - (mapWidth * mercN / (2 * Math.PI)) * 0.935;
			}
			for (let i = 0; i < route.CyclingPaths.length; i++) {
				const startPoint = route.CyclingPaths[i].Points[0];
				context.moveTo(lonToX(startPoint.lng()), latToY(startPoint.lat()));
				for (let j = 1; j < route.CyclingPaths[i].Points.length; j += 50) {
					const point = route.CyclingPaths[i].Points[j];
					context.lineTo(lonToX(point.lng()), latToY(point.lat()));
				}
			}

			for (let i = 0; i < route.TransportPaths.length; i++) {
				const startPoint = route.TransportPaths[i].Points[0];
				context.moveTo(lonToX(startPoint.lng()), latToY(startPoint.lat()));
				for (let j = 1; j < route.TransportPaths[i].Points.length; j++) {
					const point = route.TransportPaths[i].Points[j];
					context.lineTo(lonToX(point.lng()), latToY(point.lat()));
				}
			}
		};
		const canvas = document.getElementById("route-canvas");

		const paintCanvas = function () {
			var context = canvas.getContext('2d');
			context.beginPath();
			paintRoute(context, europe14);
			paintRoute(context, spain14);
			paintRoute(context, europe15);
			context.lineWidth = 1;
			context.strokeStyle = 'rgb(96, 96, 96)'; // "rgb(172, 32, 32)";
			context.stroke();
		};

		const updateCanvasSize = function () {
			canvas.width = $("#map-img").width();
			canvas.height = $("#map-img").height();
			paintCanvas();
		};

		updateCanvasSize();
		$(window).resize(() => {
			updateCanvasSize();
		});

		paintCanvas();
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
