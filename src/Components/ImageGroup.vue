<template>
	<div v-el:image-group-container class="image-group-container">
	</div>
</template>

<script>
import { Assert, IsTouchDevice, GetRandomInt } from "../scripts/MiscHelper.js";
import ImageComponent from "./Image.vue";
import Vue from "vue";

export default {
	components: {
		"image-component": ImageComponent
	},

	props: {
		groupImages: {
			type: Array,
			required: true
		}
	},

	methods: {
		GetImageByPath: function(filename) {
			return this.groupImages.find(image => image.FileName === filename);
		},

		GetImageQuality: function(imagesOnRow) {
			if(IsTouchDevice()) {
				return (imagesOnRow === 1) ? "360p" : "240p";
			}
			else {
				return (imagesOnRow === 1) ? "720p" : ((imagesOnRow === 2) ? "360p" : "240p");
			}
		}
	},

	ready: function() {
		const BaseAspectRatio = 4 / 3;
		const groupContainer = this.$els.imageGroupContainer;

		const createGroup = (allImages, firstImageIndex, imageCount) => {
			Assert(firstImageIndex + imageCount <= allImages.length, "Error creating imagegroup: index out of bounds");

			const imageQuality = this.GetImageQuality(imageCount);
			const createImageGroupTemplate = () => {
				let template = "<div class='image-group' style='padding-bottom: {0}'>"; // {0} will be set later

				let groupAspectRatio = 0;
				for(let i = firstImageIndex; i < firstImageIndex + imageCount; i++) {
					const image = this.groupImages[i];

					const MarginSize = "3px";
					const leftMargin = (i !== firstImageIndex) ? MarginSize : "0px";
					const rightMargin = (i !== firstImageIndex + imageCount - 1) ? MarginSize : "0px";

					const margin = "0px " + rightMargin + " 0px " + leftMargin;

					// create .group-image
					template += `<div class='group-image' style='flex: 1 1 ${(image.AspectRatio / BaseAspectRatio * 100)}%; margin: ${margin}'>`;
					template += `    <image-component :image='GetImageByPath("${image.FileName}")' quality='${imageQuality}' :auto-size='true' v-on:click='imageClicked(GetImageByPath("${image.FileName}"))'> </image-component>`;
					template += "</div>";

					groupAspectRatio += image.AspectRatio;
				}

				// end of .image-group
				template += "</div>";

				// i don't know if this works at all or if the results are better than without... but whatever :P close enough!
				const marginPixels = (imageCount - 1) * 6; // 2 == 1* (2* 3px), 3 == 2* (2*3px) etc
				groupAspectRatio += marginPixels / $(groupContainer).width();

				// replace the {0} that contains the padding-bottom with actual value
				template = template.replace("{0}", (1 / groupAspectRatio * 100) + "%");
				return template;
			};

			const parent = this;
			const ImageGroup = Vue.extend({
				template: createImageGroupTemplate(),
				components: {
					"image-component": ImageComponent
				},

				methods: {
					GetImageByPath: function(filename) {
						return parent.GetImageByPath(filename); // this.groupImages.find(image => image.FileName === filename);
					},

					imageClicked: function(photo) {
						parent.$parent.imageClicked(photo);
					}
				}
			});

			new ImageGroup().$mount().$appendTo(groupContainer);
			return imageCount;
		};

		const MaxImagesPerRow = IsTouchDevice() ? 2 : 2; // :P
		const generateGroups = (currentImage = 0, lastRowCount = -1) => {
			const imagesRemaining = this.groupImages.length - currentImage;
			const currentImageAtStart = currentImage;

			if(imagesRemaining === 0) {
				return;
			}
			else if(imagesRemaining <= 2) {
				currentImage += createGroup(this.groupImages, currentImage, imagesRemaining);
				return;
			}

			if(currentImage === 0) {
				currentImage += createGroup(this.groupImages, currentImage, Math.min(GetRandomInt(Math.max(2, MaxImagesPerRow - 1), MaxImagesPerRow), imagesRemaining - 2));
			}
			else {
				if(lastRowCount >= 2) {
					currentImage += createGroup(this.groupImages, currentImage, this.groupImages[currentImage].IsPortrait ? 2 : 1);
				}
				else {
					currentImage += createGroup(this.groupImages, currentImage, Math.min(MaxImagesPerRow, imagesRemaining - 2));
				}
			}

			generateGroups(currentImage, currentImage - currentImageAtStart);
		};

		generateGroups();
	}
};
</script>

<style lang="sass">
.image-group-container {
	margin: auto;
}

.image-group {
	display: flex;
	margin-bottom: 6px;
	position: relative;
	height: 0;
}

.group-image {
	flex: 1 1 100%;
	margin: 0px 3px;
	cursor: pointer;
}

.group-image img {
	width: 100%;
}
</style>
