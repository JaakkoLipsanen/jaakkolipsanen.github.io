<template>
	<div id="routeviewer-container" v-show="selectedItem != null">
		<p>{{ selectedItem.text }}</p>
		<cycle-map :route="selectedItem"></cycle-map>
		<gallery :route="selectedItem" style="margin-top: 64px"></gallery>
	</div>
</template>

<script>
import CycleMap from "./CycleMap.vue";
import Gallery from "./Gallery.vue";

export default {
	data() {
		return {
			selectedItem: null
		};
	},

	components: {
		"cycle-map": CycleMap,
		"gallery": Gallery
	},

	events: {
		"selected-route-changed": function(selectedItem) {
			this.selectedItem = selectedItem;
		}
	}
};
</script>

<style lang="sass" scoped>
</style>
