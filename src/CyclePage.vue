<template>
	<div class="tour-list-container">
		<div class="tour-block" v-for="tour in items">
			<p v-on:click="tourClicked(tour)"> {{ tour.toUpperCase() }} </p>
		</div>
	</div>
</template>

<script>

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

.tour-list-container {
	padding-top: 256px;
	color: white;
	margin: auto;
	text-align: center;
	font-size: 32px;
	font-family: "Lato";
}

a {
	color: $default-link-color;
}
</style>
