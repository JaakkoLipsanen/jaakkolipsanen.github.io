<template>
	<div id="gallery-container" class="nano">
		<div class="nano-content">
			<div class="imageBlock"  v-for="item in gallery.CurrentSource.Photos" background-color="hsl({{ n * 30}}, 50%, 50%)" style="background-image: url({{ '../' + gallery.CurrentSource.Folder + '720p/' + item.PhotoName}})">
				<div class="overlay-image">
				</div>

			</div>
		</div>
</template>

<script>
import { Gallery } from "./scripts/Gallery.js";

export default {
	props: {
		route: Object // route is the *item* of the route (so it contains 'text', description, route file path etc)
	},
	watch: {
		"route": function(value, oldValue) {
			this.gallery.SetSource(value);

			console.log("x");
			$(".nano").nanoScroller();
		}
	},
	data() {
		return {
			gallery: new Gallery()
		};
	},

	ready: function() {
		$(".hello");
		$.getScript("https://rawgit.com/kontera-technologies/nanoScrollerJS/master/bin/javascripts/jquery.nanoscroller.js", (data, textStatus, jqxhr) => {
			$(".nano").nanoScroller();
		});
	},
	events: {
		"routes-loaded": function(routes) {
			this.gallery.PreloadGalleries(routes);
		}
	}
};
</script>

<style lang="sass">
	$gallery-size: 500px;
	$background-color: rgb(44, 44, 44);
	$image-size: 25%;

	.thumbnail-image {
		width: 100%;
		height: 100%;
	}

	#gallery-container {
		width: $gallery-size;
		height: $gallery-size;

		background-color: $background-color;
		text-align: left;

		margin-left: auto;
		margin-right: auto;

		overflow-y: auto;
		overflow-x: hidden;

	}


	#gallery-container::-webkit-scrollbar { width: 0 !important }

	.imageBlock {
		text-align: left;
		width: calc(#{$image-size} - 2px);
		height: calc(#{$image-size} - 2px);
		margin: -1px 1px;

		background-color: rgb(192, 64, 64);
		display: inline-block;

		 background-size: cover;
		 background-repeat: no-repeat;

		 cursor: pointer;
	}

	.overlay-image {
		width: 100%;
		height: 100%;

		background-color: black;
		opacity: 0.5;
		transition: opacity 0.3s ease-in-out;
		&:hover {
			opacity: 0;
		}
	}



	/** initial setup **/
	.nano {
		position : relative;
		width    : 100%;
		height   : 100%;
		overflow : hidden;
	}
	.nano > .nano-content {
		position      : absolute;
		overflow      : scroll;
		overflow-x    : hidden;
		top           : 0;
		right         : 0;
		bottom        : 0;
		left          : 0;
	}
	.nano > .nano-content:focus {
		outline: thin dotted;
	}
	.nano > .nano-content::-webkit-scrollbar {
		display: none;
	}
	.has-scrollbar > .nano-content::-webkit-scrollbar {
		display: block;
	}
	.nano > .nano-pane {
		position   : absolute;
		width      : 10px;
		right      : 0;
		top        : 0;
		bottom     : 0;
		visibility : hidden\9; /* Target only IE7 and IE8 with this hack */
		opacity    : .01;
		-webkit-transition    : .2s;
		-moz-transition       : .2s;
		-o-transition         : .2s;
		transition            : .2s;
		-moz-border-radius    : 5px;
		-webkit-border-radius : 5px;
		border-radius         : 5px;
	}
	.nano > .nano-pane > .nano-slider {
		background: #444;
		background: rgba(0,0,0,1);
		position              : relative;
		margin                : 0 1px;
		-moz-border-radius    : 3px;
		-webkit-border-radius : 3px;
		border-radius         : 3px;
	}
	.nano:hover > .nano-pane, .nano-pane.active, .nano-pane.flashed {
		visibility : visible\9; /* Target only IE7 and IE8 with this hack */
		opacity    : 0.99;
	}


	.nano { background: #bba; width: 500px; height: 500px; }
	.nano .nano-content { padding: 0px; }
	.nano .nano-pane   { background: rgba(32, 32, 32, 0.75); }
	.nano .nano-slider { background-color: rgb(128, 128, 128) !important; opacity: 1 !important; }

</style>
