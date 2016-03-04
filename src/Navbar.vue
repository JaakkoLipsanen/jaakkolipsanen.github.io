<template>
	<div id="navbar-container">
		<p id="navbar-header-text">{{ title }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			title: "flai",

			items: [
				"blog",
				"routes",
				"photos",
				"",
				"coding"
			]
		};
	}
};
</script>

<style lang="sass">
	$font-stack: 'Yanone Kaffeesatz', 'Segoe UI';
	$light-gray: rgb(232, 232, 232); /* was 211, 211, 211 */

	#navbar-container {
		width: 100%;
		height: 72px;
		top: 0;
		z-index: 10;
		pointer-events: none;
	}

	#navbar-header-text {
		color: $light-gray;
		font: 400% $font-stack;

		text-align: center;
		margin: auto;
		position: absolute;
		top: 0;
		left: calc(50% - 22.5px);
	}
</style>


<style lang="sass" scoped>
	$font-stack: Open Sans;
    $list-padding: 3px;
    $list-height: 40px;
	$list-border-radius: 5px;
	$list-background-color: rgb(64, 64, 64); // todo: this should be in "general.scss" or something

	#route-selection-list-container {
		width: 510px;
		margin-left: auto;
		margin-right: 300px;

		margin-top: -32px;
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
		float: right;
    }

    #route-selection-list li {
        float: left;

        width: auto;
        height: auto;

        text-align: center;
        vertical-align: middle;
        display: table;

		margin: 0px 14px;
        transition: background-color 0.3s ease-in-out;
	}

	#route-selection-list p {
		height: 100%;

		font-size: 1.5em;
		font-family: $font-stack;
		font-weight: normal;
		color: rgb(128, 128, 128);
	}

	#route-selection-list .selected {
		background-color: rgb(64, 64, 64);
	}
</style>
