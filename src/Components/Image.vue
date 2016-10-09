<template>
	<div v-el:image-container class="image-container" style="cursor: pointer;" >
		<div v-el:sharp-image class="sharp-image"> </div>
		<div v-el:blurry-image v-if="progressive" class="blurry-image opacity-transition" :style="{ 'background-image': 'url(' + image.FullPath('10p') + ')' }"> </div>
	</div>
</template>

<script>

import { GetUriFileName } from "../scripts/FileHelper.js";

export default {
	props: {
		image: {
			type: Object,
			required: true
		},

		quality: {
			type: String,
			default: "720p"
		},

		// if this is set to true, then a 10p image is loaded first
		progressive: {
			type: Boolean,
			default: true
		},

		// okay if this gets changed after initialization, i'll ignore it
		autoSize: {
			type: Boolean,
			default: true
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
		initialize: function() {
			if(this.image == null) {
				return;
			}

			const blurryImage = $(this.$els.blurryImage);
			const sharpImage = $(this.$els.sharpImage);

			// set blurry image's transition to 1 and bypass transitions
			blurryImage.removeClass("opacity-transition");
			blurryImage.css("opacity", 1);
			blurryImage.addClass("opacity-transition");

			if(this.autoSize) {
				this.recalculateHeight();

				$(window).resize(() => {
					if(this.autoSize) {
						this.recalculateHeight();
					}
				});
			}

			const getCurrentImageSource = () => this.image.FullPath(this.quality);
			const src = getCurrentImageSource();

			const tmpImage = new Image();
			tmpImage.onload = () => {
				if(GetUriFileName(tmpImage.src) !== GetUriFileName(getCurrentImageSource())) {
					return; // image has been changed and another image is loading already
				}

				sharpImage.css("background-image", "url(    " + src + ")");
				blurryImage.css("opacity", 0);
			};
			tmpImage.src = src;
		},

		recalculateHeight: function() {
			const height = this.$els.imageContainer.offsetWidth / this.image.AspectRatio + "px";;
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

.opacity-transition {
	transition: opacity 0.75s ease-in-out;
}

.blurry-image, .sharp-image {
	width: 100%;
	height: 100%;
	position: absolute;
	opacity: 1;

	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
}

</style>
