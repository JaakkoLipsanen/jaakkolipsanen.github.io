<template>
	<div id="navbar-container">
		<p id="navbar-header-text">{{ title }}</p>

		<div class="navbar-links">
			<p  v-on:click="subLinkClicked(item, index)" :class="{ 'selected': index == selectedSubIndex }" v-for="(index, item) in items[selectedMainIndex].items">{{ item.toUpperCase() }} </p>

			<div class="header-divider"></div>
			<p style="width: 100px" v-on:click="mainLinkClicked" id="main-link"> {{ items[items.length - 1 - selectedMainIndex].main.toUpperCase() }} </p>
		</div>


		<div class="hamburger-menu">
			<p  v-on:click="subLinkClicked(item, index)" :class="{ 'selected': index == selectedSubIndex }" v-for="(index, item) in items[selectedMainIndex].items">{{ item.toUpperCase() }} </p>

			<div class="horizontal-divider"></div>
			<p style="width: 100px" v-on:click="mainLinkClicked" id="main-link"> {{ items[items.length - 1 - selectedMainIndex].main.toUpperCase() }} </p>
		</div>
		<img class="hamburger-menu-button" src="/assets/icons/HamburgerMenuBlack.svg" v-on:click="ToggleHamburgerMenu" style="width: 40px; color: white;">
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
			selectedSubIndex: 0,

			isHamburgerMenuOpen: false
		};
	},

	ready: function() {
		$(window).resize(() => {
			this.SetHamburgerMenuVisibility(false);
		});
	},

	methods: {
		mainLinkClicked: function() {
			if(this.selectedMainIndex === 0) {
				this.$root.ChangePage("cycle-about-page", "/cycle", { });
				this.selectedMainIndex = 1;
			}
			else {
				this.$root.ChangePage("code-page", "/code", { });
				this.selectedMainIndex = 0;
			}

			this.selectedSubIndex = 0;
			this.SetHamburgerMenuVisibility(false);
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
					this.$root.ChangePage("cycle-about-page", "/cycle", { });
				}
				else {
					this.$root.ChangePage("cycle-" + item + "-page", "/cycle/" + item, { });
				}
			}

			this.SetHamburgerMenuVisibility(false);
		},

		ToggleHamburgerMenu: function() {
			this.SetHamburgerMenuVisibility(!this.isHamburgerMenuOpen);
		},

		SetHamburgerMenuVisibility: function(visible) {
			this.isHamburgerMenuOpen = visible;
			$(".hamburger-menu").toggle(visible);
			$(".hamburger-menu-button").css("position", visible ? "fixed" : "absolute");
		}
	},

	events: {
		PageChanged: function(page) {
			const parts = page.split("-");
			parts.pop(); // remove last value from 'parts' (it is always 'page')

			if(parts[0] === "code") {
				this.selectedMainIndex = 0;
				if(parts.length === 1) {
					this.selectedSubIndex = 0;
				}
				else if(parts[1] === "projects") {
					this.selectedSubIndex = 1;
				}
				else if(parts[1] === "cv") {
					this.selectedSubIndex = 2;
				}
			}
			else if(parts[0] === "cycle") {
				this.selectedMainIndex = 1;
				console.log(parts);
				if(parts.length === 1) {
					return;
				}
				else if(parts[1] === "about") {
					this.selectedSubIndex = 0;
				}
				else if(parts[1] === "blog") {
					this.selectedSubIndex = 1;
				}
				else if(parts[1] === "trips" || parts[1] === "tour") {
					this.selectedSubIndex = 2;
				}
			}
			else if(parts[0] === "blog") { // "blog-post-page"
				this.selectedMainIndex = 1;
				this.selectedSubIndex = 1;
			}

			this.SetHamburgerMenuVisibility(false);
		}
	}
};
</script>

<style lang="sass">

	@media all and (max-width: 943px) {
		.hamburger-menu, .hamburger-menu-button {
			visibility: visible !important;
		}

		.navbar-links {
			visibility: hidden !important;
		}
	}

	@media all and (min-width: 944px) {
		.hamburger-menu, .hamburger-menu-button {
			visibility: hidden  !important;
		}

		.navbar-links {
			visibility: visible  !important;
		}
	}

	.hamburger-menu {
		width: 200px;
		background-color: rgb(40, 40, 40);
		height: 100vh;

		position: fixed;
		right: 0;
		top: 0;
		z-index: 1000;
		display: none;

		p {
			display: block; color: white; margin-right: 8px;
			font-size: 22px;
			font-weight: 800;
			font-family: "Open Sans";
			color: rgb(255, 255, 255);
			opacity: 0.6;

			cursor: pointer;
			transition: opacity 0.15s ease-in-out;
			margin-left: 8px;

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
			color: white;
			opacity: 0.35;

			&:hover {
				opacity: 1;
			}
		}

		$horizontal-divider-margin: 8px;
		.horizontal-divider {
		     border-top:1px solid hsl(0, 0, 60);
		     border-bottom:1px solid hsl(0, 0, 60);
		     width: calc(100% - #{$horizontal-divider-margin} * 2);
			 margin: auto $horizontal-divider-margin auto $horizontal-divider-margin;
			 display: inline-block;
			 box-sizing: border-box;
		}
	}

	.hamburger-menu-button {
	  position: fixed;
	  float: right;
	  top: 0;
	  right: 0;
	  margin-right: 8px;
	  margin-top: 6px;
	  z-index: 1001;

	  cursor: pointer;
	}

	.navbar-links {
		position: absolute; top: 0px; height: 48px;  right: 0px; margin-right: 12px;

		p {
			display: inline-block; color: white; margin-right: 8px;
			font-size: 22px;
			font-weight: 800;
			font-family: "Open Sans";
			color: rgb(8, 8, 8);
			opacity: 0.8;

			cursor: pointer;
			transition: opacity 0.15s ease-in-out;

			&:hover {
				color: rgb(0, 0, 0);;
				opacity: 1;
			}

			&.selected {
				color: rgb(32, 32, 32);
				opacity: 1;
			}
		}

		p:last-child {
			margin-left: 8px;
			color: rgb(8, 8, 8);;
			opacity: 0.35;

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
	$title-color: rgb(32, 32, 32); /* was 211, 211, 211 */

	#navbar-container {
		width: 100%;
		height: 72px;
		top: 0;
		z-index: 100;
		position: absolute;
	}

	#navbar-header-text {
		color: $title-color;
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
