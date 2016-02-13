<template>
	<div id="route-selection-list-container">
		<ul id="route-selection-list">
			<li v-for="(index, item) in items" v-bind:class="{ 'selected': $index == selectedIndex }" v-on:click="itemClicked">
				<p class="europe14-trip-button">{{ item }}</p>
			</li>
		</ul>
	</div>
</template>

<script>

export default {
	data() {
		return {
			selectedIndex: -1,
			items: [
				"BLOG",
				"ROUTES",
				"PHOTOS",
				"",
				"CODING"
			]
		};
	},

	methods: {
		itemClicked: function(event) {

		}
	}
};
</script>

<style lang="sass" scoped>
	$font-stack: Open Sans;
    $list-padding: 3px;
    $list-height: 40px;
	$list-border-radius: 5px;
	$list-background-color: rgb(64, 64, 64); // todo: this should be in "general.scss" or something

	#route-selection-list-container {
		width: 510px;
		margin-left: auto;
		margin-right: 0;

		margin-top: -80px;
	}

    #route-selection-list {
        list-style-type: none;
        text-align: right;
        margin: 0px;

        display: inline-block;

        /* 3px == real padding. 7px == 3px + 4px. 4px because no fucking clue why it's needed on bottom */
        padding: $list-padding $list-padding calc(#{$list-padding} + 4px);
        height: $list-height;

        border-radius: $list-border-radius;
    }

    #route-selection-list li {
        float: left;

        width: auto;
        height: auto;

        text-align: center;
        vertical-align: middle;
        display: table;

		margin: 0px 14px;
        background-color: rgb(24, 24, 24); /* the site background color */
        transition: background-color 0.3s ease-in-out;
	}

	#route-selection-list p {
		height: 100%;

		font-size: 1.5em;
		font-family: $font-stack;
		color: rgb(128, 128, 128);
	}

	#route-selection-list .selected {
		background-color: rgb(64, 64, 64);
	}
</style>
