<template>
	<div class="tour-list-container">
		<world-map style="height: 60vh" id="world-map"></world-map>
		<div></div>
		<div class="tour-block" v-for="tour in items">
			<p v-on:click="tourClicked(tour)"> {{ tour.toUpperCase() }} </p>
		</div>
	</div>
</template>

<script>
import WorldMap from "../Components/WorldMap.vue";
export default {
	data() {
		return {
			items: [
				"europe15",
				"spain14",
				"europe14"
			]
		};
	},

	components: {
		"world-map": WorldMap
	},

	ready: function() {
	},

	methods: {
		tourClicked: function(tour) {
			console.log(tour);
			this.$root.ChangePage("cycle-tour-page", "/cycle/trips/" + tour, { TourName: tour });
		//	this.$dispatch("change-page", "blog-post-page");
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>
$default-link-color: desaturate(rgb(144, 144, 255), 5);

#world-map {
	width: 100%;
	height: 70vh;
}

.tour-list-container {
	padding-top: 64px;
	color: white;
	margin: auto;
	text-align: center;

	p {
		font-size: 32px;
		font-weight: 800;
		cursor: pointer;
	}

	.tour-block {
		display: inline-block;
		margin: auto 16px;
	}
}

a {
	color: $default-link-color;
}
</style>
