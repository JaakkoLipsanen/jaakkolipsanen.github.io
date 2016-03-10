<template>
	<div id="navbar-container">
		<p id="navbar-header-text">{{ title }}</p>
		<div class="navbar-links" style="">
			<p  v-on:click="subLinkClicked(item, index)" :class="{ 'selected': index == selectedSubIndex }" v-for="(index, item) in items[selectedMainIndex].items">{{ item.toUpperCase() }} </p>

			<div class="header-divider"></div>
			<p style="width: 100px" v-on:click="mainLinkClicked" id="main-link"> {{ items[items.length - 1 - selectedMainIndex].main.toUpperCase() }} </p>
		</div>

	</div>
</template>

<script>
export default {
	data() {
		return {
			title: "flai",

			items: [
				{ main: "coding", items: ["about", "projects", "cv"] },
				{ main: "cycling", items: ["about", "blog", "trips"] }
			],

			selectedMainIndex: 1,
			selectedSubIndex: 0
		};
	},

	methods: {
		mainLinkClicked: function() {
			if(this.selectedMainIndex === 0) {
				this.$root.ChangePage("cycle-page", "/cycle", { });
				this.selectedMainIndex = 1;
			}
			else {
				this.$root.ChangePage("code-page", "/code", { });
				this.selectedMainIndex = 0;
			}

			this.selectedSubIndex = 0;
		},

		subLinkClicked: function(item, index) {
			this.selectedSubIndex = index;
			if(this.selectedMainIndex === 0) { // "coding"
				if(index === 0) { // "about"
					this.$root.ChangePage("code-page", "/code", { });
				}
				else {
					this.$root.ChangePage("code-" + item + "-page", "/code/" + item, { });
				}
			}
			else {
				if(index === 0) { // "about"
					this.$root.ChangePage("cycle-page", "/cycle", { });
				}
				else {
					this.$root.ChangePage("cycle-" + item + "-page", "/cycle/" + item, { });
				}
			}
		}
	},

	events: {
		PageChanged: function(page) {
			console.log("xxxx");
			const parts = page.split("-");
			parts.pop(); // remove last value from 'parts' (it is always 'page')
			
			if(parts[0] == "code") {
				this.selectedMainIndex = 0;
				if(parts.length == 1) {
					this.selectedSubIndex = 0;
				}
				else if(parts[1] == "projects") {
					this.selectedSubIndex = 1;
				}
				else if(parts[1] == "cv") {
					this.selectedSubIndex = 2;
				}
			}
			else if(parts[0] == "cycle") {
				this.selectedMainIndex = 1;
				if(parts.length == 1) {
					this.selectedSubIndex = 0;
				}
				else if(parts[1] == "blog") {
					this.selectedSubIndex = 1;
				}
				else {
					this.selectedSubIndex = 2;
				}
			}
		}
	}
};
</script>

<style lang="sass">

	.navbar-links {
		position: absolute; top: 0px; height: 48px;  right: 0px; margin-right: 12px;

		p {
			display: inline-block; color: white; margin-right: 8px;
			font-size: 22px;
			font-weight: 800;
			font-family: "Open Sans";
			color: rgb(255, 255, 255);
			opacity: 0.6;

			cursor: pointer;
			transition: opacity 0.15s ease-in-out;

			&:hover {
				color: white;
				opacity: 1;
			}

			&.selected {
				color: white;
				opacity: 1;
			}
		}

		p:last-child {
			margin-left: 8px;
			color: white;
			opacity: 0.45;

			&:hover {
				opacity: 1;
			}
		}
	}

	.header-divider {
	     border-left:1px solid hsl(0, 0, 60);
	     border-right:1px solid hsl(0, 0, 60);
	     height: 32px;
	     margin-bottom: -10px;
		 display: inline-block;
	}


	$font-stack: 'Yanone Kaffeesatz', 'Segoe UI';
	$light-gray: rgb(232, 232, 232); /* was 211, 211, 211 */

	#navbar-container {
		width: 100%;
		height: 72px;
		top: 0;
		z-index: 100;
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
