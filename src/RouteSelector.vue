<template>
	<div id="route-selection-list-container" style="margin-top: 64px">
		<ul id="route-selection-list">
			<li v-for="(index, item) in items" v-bind:class="{ 'selected': $index == selectedIndex }" v-on:click="changeRoute">
				<p id="europe14-trip-button">{{ item.name }} <span style="display: block;">{{ item.year }}</span></p>
			</li>
		</ul>
	</div>
</template>

<script>

export default {
	props: {
		items: Array
	},

	data() {
		return {
			selectedIndex: -1
		};
	},

	methods: {
		// called when route button is clicked
		changeRoute: function(event) {
			this.selectedIndex = $("li").index($(event.currentTarget));
			this.$dispatch("selected-changed", this.items[this.selectedIndex]);

			// todo: make the animation length depend on scrolling distance
			$("html, body").animate({
				scrollTop: $("#route-selection-list").offset().top - 24
			}, 750);
		}
	}
};
</script>

<style lang="sass" scoped>
	@import url(https://fonts.googleapis.com/css?family=Open+Sans);
	$font-stack: Open Sans;
    $list-padding: 3px;
    $list-height: 40px;
	$list-border-radius: 5px;
	$list-background-color: rgb(64, 64, 64); // todo: this should be in "general.scss" or something

	#route-selection-list-container {
		display: table;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}

    #route-selection-list {
        list-style-type: none;
        text-align: center;
        margin: 0px;

        display: inline-block;

        width: 600px;
        max-width: 90%;

        /* 3px == real padding. 7px == 3px + 4px. 4px because no fucking clue why it's needed on bottom */
        padding: $list-padding $list-padding calc(#{$list-padding} + 4px);
        height: $list-height;

        background-color: $list-background-color;
        border-radius: $list-border-radius;
    }

    #route-selection-list li {
        float: left;

        width: 33.33333%;
        height: auto;

        text-align: center;
        vertical-align: middle;
        display: table;

        background-color: rgb(24, 24, 24); /* the site background color */
        transition: background-color 0.3s ease-in-out;
	}

	#route-selection-list p {
		height: 100%;
		display: table-cell;
		vertical-align: middle;

		font-size: 1em;
		font-family: $font-stack;
		color: rgb(128, 128, 128);
	}

	#route-selection-list span {
		color: rgb(88, 88, 88);
	}

	#route-selection-list .selected {
		background-color: rgb(64, 64, 64);
	}
</style>
