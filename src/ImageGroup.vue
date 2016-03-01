<template>
	<div class="image-group-container">
	</div>
</template>

<script>
import { Assert, IsTouchDevice, GetRandomInt } from "./scripts/MiscHelper.js";

export default {
	props: {
		groupImages: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
		};
	},

	ready: function() {
		const MaxImagesPerRow = IsTouchDevice() ? 2 : 4;
		const BaseAspectRatio = 4 / 3;
		const groupContainer = $(".image-group-container");

		const createGroup = (allImages, firstImageIndex, imageCount) => {
			Assert(firstImageIndex + imageCount <= allImages.length, "Error creating imagegroup: index out of bounds");

			const container = $(document.createElement("div")).addClass("image-group").appendTo(groupContainer);
			for(let i = firstImageIndex; i < firstImageIndex + imageCount; i++) {
				const image = this.groupImages[i];

				// the flex value is calculated by "imageAspectRatio / BaseAspectRatio". BaseAR is 4/3, so for 3:4 images for example value is 3/4 / (4/3) * 100 = 56.25
				const imageContainer = $(document.createElement("div")).addClass("group-image").css("flex", "1 1 " + (image.AspectRatio / BaseAspectRatio * 100) + "%");
				const imageElement = $(document.createElement("img")).attr("src", image.FullPath);

				imageElement.appendTo(imageContainer);
				imageContainer.appendTo(container);
			}

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
					currentImage += createGroup(this.groupImages, currentImage, Math.min(MaxImagesPerRow, imagesRemaining));
				}
			}

			generateGroups(currentImage, currentImage - currentImageAtStart);
		};

		generateGroups();
	}

};
</script>

<style lang="sass" scoped>

.image-group {
	display: flex;
	width: 70%;
	margin: 0 auto;
}

.group-image {
	flex: 1 1 100%;
	margin: 0px 3px;
}

.group-image {
	width: 100%;
}

</style>
