<template>
	<div v-el:image-container class="image-container" style="cursor: pointer;"  v-on:click="imageClicked(block.Image)" >
		<div v-el:sharp-image class="sharp-image"> </div>
		<div v-el:blurry-image v-if="progressive" class="blurry-image opacity-transition" style="background-image: url({{ image.FullPath('10p') }})" v-on:click="imageClicked(block.Image)"> </div>
	</div>
</template>

<script>
import { Assert, IsTouchDevice, GetRandomInt } from "../scripts/MiscHelper.js";
import { PhotoQuality } from "../scripts/Photo.js";

export default {
	props: {
		image: {
			type: Object,
			required: true,
		},

		quality: {
			type: String,
			default: '720p'
		},

		// if this is set to true, then a 10p image is loaded first
		progressive : {
			type: Boolean,
			default: true,
		}
	},

	watch: {
		"image": function(value, oldValue) {
			this.initialize();
		}
	},

	ready: function() {
		this.initialize();
	},

	methods: {
		calculateImagePadding: function(image) {
			return (1 / image.AspectRatio * 100) + "%";
		},

		initialize: function() {
			var blurryImage = $(this.$els.blurryImage);
			var sharpImage = $(this.$els.sharpImage);

			// set blurry image's transition to 1 and bypass transitions
			blurryImage.removeClass("opacity-transition");
			blurryImage.css("opacity", 1);
			blurryImage.addClass("opacity-transition");

			this.recalculateHeight();
			$(window).resize(() => {
				this.recalculateHeight();
			});

			var tmpImage = new Image();
			var src = this.image.FullPath(this.quality);
			tmpImage.onload = () => {
				sharpImage.css("background-image", "url(    " + src + ")");
				blurryImage.css("opacity", 0);
			};
			tmpImage.src = src;
		},

		recalculateHeight: function() {
			var height = this.$els.imageContainer.offsetWidth / this.image.AspectRatio + "px";;
			$(this.$els.imageContainer).css("height", height);
		}
	}
};
</script>

<style lang="sass">
.image-container {
	position: relative;
	height: 0;
	background-color: rgb(215, 215, 215);
	overflow: hidden;
}

.blurry-image {
	width: 100%;
	height: 100%;

	opacity: 1;
	background-size: cover;
	background-repeat: no-repeat;
	position: absolute;
}

.opacity-transition {
	transition: opacity 0.75s ease-in-out;
}

.sharp-image {
	position: absolute;
	opacity: 1;
	background-size: cover;
	width: 100%;
	height: 100%;

}

</style>
