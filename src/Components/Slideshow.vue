<template>
	<div v-el:slideshow-container class="slideshow-container">
		<div class="slideshow-image foreground a"></div>
		<div class="slideshow-image b" ></div>
	</div>
</template>

<script>

import ImageComponent from "./Image.vue";

export default {
	components: {
		"image-component": ImageComponent
	},

	props: {
		images: {
			type: Array,
			required: true
		},

		quality: {
			type: String,
			default: "orig"
		},

		time: {
			type: Number,
			default: 4
		},

		fadeTime: {
			type: Number,
			default: 1.5
		}
	},

	data() {
		return {
			nextImageIndex: 0
		};
	},

	ready: function() {
		const loadNextImage = () => {

			const foreground = this.getForegroundImage();
			const background = this.getBackgroundImage();

			foreground.css("transition", "opacity " + this.fadeTime + "s");
			background.css("transition", "opacity " + this.fadeTime + "s");

			const newImageUrl = this.images[this.nextImageIndex++].FullPath(this.quality);
			if(this.nextImageIndex >= this.images.length) {
				this.nextImageIndex = 0;
			}

			// from http://stackoverflow.com/a/5058336
			$('<img/>').attr('src', newImageUrl).one("load", () => { // todo: start loading this asap after the previous image is loaded
				$(this).remove(); // prevent memory leaks as @benweet suggested
				
				foreground.css("opacity", 0);
				background.css("opacity", 1);

				foreground.toggleClass("foreground");
				background.toggleClass("foreground");

				background.css("background-image", "url(" + newImageUrl + ")");
				setTimeout(loadNextImage, this.time * 1000);
			});
		};

		if(this.images.length > 0) {
			loadNextImage();
		}
	},

	methods: {
		getForegroundImage: function() {
			return $(this.$els.slideshowContainer).find(".slideshow-image.foreground");
		},

		getBackgroundImage: function() {
			return $(this.$els.slideshowContainer).find(".slideshow-image:not(.foreground)");
		}
	}
};
</script>

<style lang="sass" scoped>

.slideshow-image {
	position: absolute;
	top: 0;
	width: 100%;
	display: block;

	opacity: 0;
	transition: opacity 1s;
	height: 100%;

	background-size: cover;
	background-position: center;
}

.slideshow-container {
	position: relative;
}

</style>
