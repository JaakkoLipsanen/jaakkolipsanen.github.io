<template>
	<div id="navbar-container">
		<p id="navbar-header-text">{{ title }}</p>

		<div class="navbar-links">
			<a :href="getSublinkAddress(item)" v-on:click="subLinkClicked($event, item, index)" :class="{ 'selected': index == selectedSubIndex, 'disabled': !item.enabled }" v-for="(index, item) in navbarLinks">{{ item.name.toUpperCase() }} </a>
		</div>

		<a href="https://instagram.com/fl.ai">
			<img class="instagram-icon" src="/icons/Instagram-Icon.png">
		</a>

		<div class="hamburger-menu">
			<img class="hamburger-menu-close-button" src="/icons/close.png" v-on:click="SetHamburgerMenuOpen(false)">
			<a :href="getSublinkAddress(item)" v-on:click="subLinkClicked($event, item, index)" :class="{ 'selected': index == selectedSubIndex, 'disabled': !item.enabled }" v-for="(index, item) in navbarLinks">{{ item.name.toUpperCase() }} </a>
		</div>

		<hamburger-menu-button class="hamburger-menu-button" :text="navbarLinks[selectedSubIndex].name" v-on:click="SetHamburgerMenuOpen(true)"></hamburger-menu-button>
	</div>
</template>

<script>

import HamburgerMenuButton from "./HamburgerMenuButton.vue";

export default {
	data() {
		return {
			title: "flai",

			navbarLinks: [
				{ name: "home", enabled: false },
				{ name: "blog", enabled: true },
				{ name: "gear", enabled: false },
				{ name: "tours", enabled: true }
			],

			selectedSubIndex: 0,

			isHamburgerMenuOpen: false,
			isSmallNavbarForced: false
		};
	},

	components: {
		"hamburger-menu-button": HamburgerMenuButton
	},

	ready: function() {
		$(window).resize(() => {
		//	this.SetHamburgerMenuOpen(false); // is this really needed?
			this.updateNavbarSize();
		});

		$(window).scroll(() => {
			this.updateNavbarSize();
		});
	},

	methods: {
		updateNavbarSize: function() {
			if ($(document).scrollTop() > 0 || this.IsSmallNavbarForced()) {
				$("#navbar-container").addClass("shrink");
			}
			else if(!this.IsSmallNavbarForced()) {
				$("#navbar-container").removeClass("shrink");
			}
		},

		subLinkClicked: function(event, item, index) {
			if(event.which !== 1) { // "1" means left-click
				return; // let the link do it's own stuff if middle or right click
			}

			// on left click cancel the <a> href and change the page via code
			event.preventDefault();
			if(!item.enabled) {
				return false;
			}

			this.selectedSubIndex = index;
			if(index === 0) { // "home"
				this.$root.ChangePage("home-page", "/", { });
			}
			else if(index === 1) { // "blog"
				this.$root.ChangePage("blog-list-page", "/blog", { });
			}
			else if(index === 2) { // gear
				this.$root.ChangePage("gear-page", "/gear", { });
			}
			else if(index === 3) { // "tours"
				this.$root.ChangePage("tours-page", "/tours", { });
			}

			this.SetHamburgerMenuOpen(false);
			return false; // cancel <a> link click
		},

		getSublinkAddress: function(item) {
			if(item.name === "home") return "/";

			return "/" + item.name;
		},

		ToggleHamburgerMenu: function() {
			this.SetHamburgerMenuOpen(!this.isHamburgerMenuOpen);
		},

		SetHamburgerMenuOpen: function(open) {
			this.isHamburgerMenuOpen = open;

			$(".hamburger-menu").toggleClass("open-hamburger-menu", open);
		},

		IsSmallNavbarForced: function() {
			const isHamburgerMenuVisible = $(".hamburger-menu-button").is(":visible");
			return this.isSmallNavbarForced || isHamburgerMenuVisible;
		}
	},

	events: {
		PageChanged: function(page) {
			const parts = page.split("-");
			parts.pop(); // remove last value from 'parts' (it is always 'page')

			this.isSmallNavbarForced = false;
			if(parts[0] === "blog") {
				this.selectedSubIndex = 1;
				this.isSmallNavbarForced = (parts[1] === "post"); // if blog-POST-page
			}
			else if(parts[0] === "gear") {
				this.selectedSubIndex = 2;
			}
			else if(parts[0] === "home") {
				this.selectedSubIndex = 0;
			}
			else if(parts[0] === "tours") {
				this.selectedSubIndex = 3;
			}

			this.updateNavbarSize();
			this.SetHamburgerMenuOpen(false);
		}
	}
};
</script>

<style lang="sass">

	@media all and (max-width: 615px) {
		.hamburger-menu-button {
			display: block !important;
		}

		.navbar-links {
			display: none !important;
		}
	}

	@media all and (min-width: 616px) {
		.hamburger-menu, .hamburger-menu-button {
			display: none  !important;
		}

		.navbar-links {
			display: block  !important;
		}
	}

	.instagram-icon {
		position: absolute;
		top: 50%;
		right: 16px;
		transform: translateY(-50%);
		transition: height 0.2s;

		height: 36%;
		min-height: 30px;

		&:hover {
			transform: translateY(-50%) scale(1.1333333333) ;
		}
	}

	.open-hamburger-menu {
		width: 100% !important;
		height: 110vh !important;
	}

	.hamburger-menu {
		width: 0px;
		height: 0px;
		background-color: rgb(32, 32, 32);
		transition: width .4s, height .4s;

		position: fixed;
		left: 0;
		top: 0;
		z-index: 1000;

		padding-top: 16px;
		overflow: hidden;

		a {
			display: block; margin-right: 8px;
			font-size: 22px;
			font-weight: 700;
			font-family: "Raleway";
			color: white;;
			opacity: 0.75;

			border-bottom: 2px solid transparent;;
			cursor: pointer;
			transition: opacity 0.15s ease-in-out;
			width: auto;
			padding: 3px 1px;

			display: table;
			text-decoration: none;
			margin: 1em 0px;
			margin-left: 24px;

			&:hover:not(.disabled):not(.selected) {
				opacity: 1;
				border-bottom: 2px solid rgba(255, 255, 255, 0.5);
			}

			&.selected {
				opacity: 1;
				font-weight: 800 !important;
				border-bottom: 2px solid white;
			}

			&.disabled {
				opacity: 0.3;
				cursor: default;
				pointer-events: none;
			}
		}

		.hamburger-menu-close-button {
			width: 24px;
			height: 24px;
			position: absolute;
			top: 38px;
			right: 24px;

			opacity: 0.75;
			cursor: pointer;

			&:hover {
				opacity: 0.9;
			}
		}
	}

	.navbar-links {
		height: 100%;
		width: 100%;
		margin: auto;
		text-align: center;

		a {
			text-decoration: none;
			display: inline-block;
			font-weight: 600;
			font-family: "Raleway";
			color: black;
			opacity: 1;

			margin-right: 64px;

			cursor: pointer;
			transition: opacity 0.15s ease-in-out, border-bottom 0.2s ease-in-out;
			border-bottom: 2px solid transparent;
			padding-bottom: 3px;
			padding: 3px 1px;

			position: relative;
			top: 50%;
			margin-top: 0px;
			margin-bottom: 0px;
			transform: translateY(-50%);

			&:hover:not(.disabled) {
				opacity: 1;
				border-bottom: 2px solid rgba(0, 0, 0, 0.5);
			}

			&.selected:not(.disabled) {
				opacity: 1;
				border-bottom: 2px solid black;
			}

			&.disabled {
				color: rgba(0, 0, 0, 0.4);
				cursor: default;
				pointer-events: none;
			}

			&:last-child {
				/* last child should have no margin, so that the centering works properly */
				margin-right: 0px;
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

	#navbar-container {
		width: 100%;
		height: 118px;
		background-color: white;
		top: 0;
		font-size: 20px;
		z-index: 100;

		transition: height 0.2s, font-size 0.2s;
		position: fixed;

		&.shrink {
			height: 40px;
			position: fixed;
			font-size: 16px;

		//	border-bottom: solid 1px rgba(200, 200, 200, 0.5);
		}
	}

	#navbar-header-text {
		color: rgb(64, 64, 64);
		font-size: 50px;
		font-family: "Lato";
		font-weight: 300;

		width: 100%;
		height: 100%;
		text-align: center;
		margin: auto;
		position: absolute;
		top: -3px;
		display: none;
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
