<template>
	<div id="routeviewer-container" v-show="selectedItem != null">
		<p>{{ selectedItem.text }}</p>
		<cycle-map :route="selectedItem"></cycle-map>
	</div>
</template>

<script>
import CycleMap from "./CycleMap.vue";

export default {
	data() {
		return {
			selectedItem: null
		};
	},

	components: {
		"cycle-map": CycleMap
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
