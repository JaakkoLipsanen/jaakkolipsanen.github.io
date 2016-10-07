<template>
	<div v-el:image-group-container class="image-group-container">
	</div>
</template>

<script>
import { Assert, IsTouchDevice, GetRandomInt } from "../scripts/MiscHelper.js";
import { PhotoQuality } from "../scripts/Photo.js";

export default {
	props: {
		groupImages: {
			type: Array,
			required: true
		}
	},

	ready: function() {
		const MaxImagesPerRow = IsTouchDevice() ? 2 : 2; // TODO: ANTTI MUUTA TÄTÄ JOS TÄÄ UPDATE KUSEE
		const BaseAspectRatio = 4 / 3;
		const groupContainer = this.$els.imageGroupContainer;
		const parent = this.$parent;

		const createGroup = (allImages, firstImageIndex, imageCount) => {
			Assert(firstImageIndex + imageCount <= allImages.length, "Error creating imagegroup: index out of bounds");

			let imageQuality;
			if(IsTouchDevice()) {
				imageQuality = (imageCount === 1) ? "360p" : "240p";
			}
			else {
				imageQuality = (imageCount === 1) ? "720p" : ((imageCount === 2) ? "360p" : "240p");
			}

			const container = $(document.createElement("div")).addClass("image-group").appendTo(groupContainer);
			var groupAspectRatio = 0;
			for(let i = firstImageIndex; i < firstImageIndex + imageCount; i++) {
				const image = this.groupImages[i];

				// the flex value is calculated by "imageAspectRatio / BaseAspectRatio". BaseAR is 4/3, so for 3:4 images for example value is 3/4 / (4/3) * 100 = 56.25
				const imageContainer = $(document.createElement("div")).addClass("group-image").css("flex", "1 1 " + (image.AspectRatio / BaseAspectRatio * 100) + "%");
				const imageElement = $(document.createElement("img")).attr("src", image.FullPath(imageQuality));

				groupAspectRatio += image.AspectRatio;

				imageElement.appendTo(imageContainer);
				imageContainer.appendTo(container);

				imageContainer.click(function() {
					parent.imageClicked(image);
				});
			}

			var marginPixels = 3 * 2;
			groupAspectRatio += marginPixels / container.width();

			// okay, this padding-bottom value IS NOT CORRECT. it would be correct if the images didn't have margin, but they have. I'm not sure how to calculate this,
			// it's possible that I have to update the value everytime the image-group/window is resized :///
			container.css("padding-bottom", "calc(" + (1 / groupAspectRatio * 100) + "%)");
			container.css("position", "relative");
			container.css("height", "0");
		//	container.css("background-color", "gray"); // also, right now this is applied to the group container which is NOT CORRECT. I want this to be applied only to individual images

			return imageCount;
		};

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
