<template>
	<ul id="entry-list">
		<li>blog page</li>
		<li>blog page 2</li>

	<ul>
</template>

<script>
import Footer from "./Footer.vue";

export default {
	data() {
		return {
		};
	},

	components: {
		"footer-bar": Footer
	},

	ready: function() {
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

#entry-list {
	color: rgb(211, 211, 211);
	list-style-type: none;

	font-size: 18px;
	li {
		margin: 4px 0;
	}
}
</style>
