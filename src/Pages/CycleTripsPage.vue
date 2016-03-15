<template>
	<div class="tour-list-container">
		<world-map class="world-map"></world-map>
		<div></div>

		<div class="tour-block-list-container">
			<div class="tour-block" v-for="tour in items">
				<p v-on:click="tourClicked(tour)"> {{ tour.toUpperCase() }} </p>
			</div>
		</div>
	</div>
</template>

<script>
import WorldMap from "../Components/WorldMap.vue";
export default {
	data() {
		return {
			items: [
				"europe2015",
				"spain2014",
				"europe2014"
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
			this.$root.ChangePage("cycle-tour-page", "/cycle/trips/" + tour, { TourName: tour });
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>
$default-link-color: desaturate(rgb(144, 144, 255), 5);

@media all and (max-width: 720px), all and (max-height: 413px)  {
	.world-map {
		display: none !important;
	}

	.tour-block {
		display: block !important;
		height: auto !important;
	}

	.tour-list-container {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 0; right: 0;
	}
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
		height: 64px;
	}
}

a {
	color: $default-link-color;
}
</style>
