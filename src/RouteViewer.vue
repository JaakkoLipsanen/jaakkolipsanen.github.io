<template>
	<div id="content-div">
		<p>{{ route.text }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			route: null
		};
	},

	events: {
		"selected-route-changed": function(route) {
			this.route = route;
		}
	}
};
</script>

<style lang="sass" scoped>
	p {
		color: white;
	}
</style>
