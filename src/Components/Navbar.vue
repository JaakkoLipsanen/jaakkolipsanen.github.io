<template>
	<div id="navbar-container">
		<p id="navbar-header-text">{{ title }}</p>

		<div class="navbar-links">
			<p v-on:click="subLinkClicked(item, index)" :class="{ 'selected': index == selectedSubIndex, 'disabled': !item.enabled }" v-for="(index, item) in navbarLinks">{{ item.name.toUpperCase() }} </p>
		</div>

		<a href="https://instagram.com/fl.ai">
			<img class="instagram-icon" src="/icons/Instagram-Icon.png">
		</a>

		<div class="hamburger-menu">
			<p v-on:click="subLinkClicked(item, index)" :class="{ 'selected': index == selectedSubIndex }" v-for="(index, item) in navbarLinks">{{ item.name.toUpperCase() }} </p>
		</div>
		<img v-el:hamburger-menu-button  class="hamburger-menu-button" src="/icons/HamburgerMenuBlack.svg" v-on:click="ToggleHamburgerMenu">
	</div>
</template>

<script>
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
			isSmallNavbarForced: false,
		};
	},

	ready: function() {
		$(window).resize(() => {
			this.SetHamburgerMenuVisibility(false);
			this.updateNavbarSize();
		});

		$(window).scroll(() => {
			this.updateNavbarSize();
		});
	},

	methods: {
		updateNavbarSize: function() {
			if ($(document).scrollTop() > 0 || this.IsSmallNavbarForced()) {
				$('#navbar-container').addClass('shrink');
			}
			else if(!this.IsSmallNavbarForced()) {
				$('#navbar-container').removeClass('shrink');
			}
		},

		subLinkClicked: function(item, index) {
			if(!item.enabled) {
				return;
			}

			this.selectedSubIndex = index;

			if(index === 0) { // "home"
				this.$root.ChangePage("home-page", "/cycle", { });
			}
			else if(index === 1) { // "blog"
				this.$root.ChangePage("blog-list-page", "/cycle/blog", { });
			}
			else if(index == 2) { // gear
				this.$root.ChangePage("gear-page", "/cycle/gear", { });
			}
			else if(index == 3) { // "tours"
				this.$root.ChangePage("cycle-tours-page", "/cycle/tours", { });
			}

			this.SetHamburgerMenuVisibility(false);
		},

		ToggleHamburgerMenu: function() {
			this.SetHamburgerMenuVisibility(!this.isHamburgerMenuOpen);
		},

		SetHamburgerMenuVisibility: function(visible) {
			this.isHamburgerMenuOpen = visible;
			$(".hamburger-menu").toggle(visible);
		},

		IsSmallNavbarForced: function() {
			let isHamburgerMenuVisible = $(".hamburger-menu-button").is(":visible");
			return this.isSmallNavbarForced || isHamburgerMenuVisible;
		}
	},

	events: {
		PageChanged: function(page) {
			const parts = page.split("-");
			parts.pop(); // remove last value from 'parts' (it is always 'page')

			this.isSmallNavbarForced = false;
			if(parts[0] === "cycle") {
				if(parts.length === 1) {
					return;
				}
				else if(parts[1] === "about") {
					this.selectedSubIndex = 0;
				}
				else if(parts[1] === "blog") {
					this.selectedSubIndex = 1;
					if(parts.length > 2) {
						this.isSmallNavbarForced = true;
					}
				}
				else if(parts[1] === "trips" || parts[1] === "tours") {
					this.selectedSubIndex = 3;
				}
			}
			else if(parts[0] === "blog") {
				this.selectedSubIndex = 1;
				this.isSmallNavbarForced = (parts[1] === "post");
			}
			else if(parts[0] == "gear") {
				this.selectedSubIndex = 2;
			}
			else if(parts[0] == "home") {
				this.selectedSubIndex = 0;
			}

			this.updateNavbarSize();
			this.SetHamburgerMenuVisibility(false);
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

	.hamburger-menu {
		width: 200px;
		background-color: white;
		height: 100vh;

		position: fixed;
		left: 0;
		top: 0;
		z-index: 1000;
		display: none;

		margin-top: 32px;

		p {
			display: block; margin-right: 8px;
			font-size: 22px;
			font-weight: 800;
			font-family: "Open Sans";
			color: black;
			opacity: 0.6;

			cursor: pointer;
			transition: opacity 0.15s ease-in-out;
			margin-left: 8px;

			&:hover {
				opacity: 1;
			}

			&.selected {
				opacity: 1;
			}

			&.disabled {

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
		height: 36%;
		min-height: 32px;

		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		margin-top: 0px;
		margin-left: 8px;

		cursor: pointer;
	}

	.navbar-links {
		height: 100%;
		width: 100%;
		margin: auto;
		text-align: center;

		p {
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
