<template>
	<div v-el:slideshow-container class="slideshow-container">
		<img class="slideshow-image foreground a">
		<img class="slideshow-image b" >
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
			default: "1080p"
		},

		time: {
			type: Number,
			default: 4.5
		},

		fadeTime: {
			type: Number,
			default: 1
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

			background.attr("src", null);
			background.one("load", () => { // TODO!!!! START LOADING THIS RIGHT AWAY AFTER PREVIOUS IMAGE IS LOADED!!
				foreground.css("opacity", 0);
				background.css("opacity", 1);

				foreground.toggleClass("foreground");
				background.toggleClass("foreground");

				setTimeout(loadNextImage, this.time * 1000);
			});

			background.attr("src", this.images[this.nextImageIndex].FullPath(this.quality));
			this.nextImageIndex++;

			if(this.nextImageIndex >= this.images.length) {
				this.nextImageIndex = 0;
			}
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
}

.slideshow-container {
	position: relative;
	margin: auto;
}

</style>
