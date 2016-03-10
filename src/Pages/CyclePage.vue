<template>
	<div class="tour-list-container">
		<p style="margin-top: 50vh">Hello! I'm a cyclist tadadadadaah! </p>
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
			],
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
			this.$root.ChangePage("cycle-tour-page", "/cycle/" + tour, { TourName: tour });
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
}

a {
	color: $default-link-color;
}
</style>
