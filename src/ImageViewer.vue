<template>
	<div id="image-viewer-container" v-on:click="closeImage" >
		<div class='gallery-background'></div>

		<div id="image-container" >
			<img id="image" src="{{ currentImagePath }}">
			<p id="description-text">hello</p>
		</div>
	</div>
</template>

<script>
import { PhotoType } from "./scripts/Gallery.js";

export default {
	data() {
		return {
			currentPhoto: null,
			gallerySource: null
		};
	},

	methods: {
		"closeImage": function() {
			$("#image-viewer-container").hide();
		}
	},

	computed: {
		currentImagePath: function() {
			if(this.gallerySource == null || this.currentPhoto == null) {
				return "";
			}

			return this.gallerySource.GetPath(this.currentPhoto, PhotoType.Fullsize);
		}
	},

	events: {
		"photo-selected": function(gallerySource, photo) {
			this.gallerySource = gallerySource;
			this.currentPhoto = photo;
			$("#image-viewer-container").show();
		}
	}
};
</script>

<style lang="sass" scoped>
	#image-viewer-container {
		transition: opacity 0.3s ease-in-out;
		opacity: 1;
	}

	.gallery-background {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		background-color: black;
		opacity: 0.7;

		cursor: pointer;
	}

	#image {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;

		max-width: 80%;
		max-height: 85%;
	}

	#image-container {
		position: fixed;

		left: 0;
		right: 0;
		bottom: 0;
		top: 0;

		width: 100%;
		height: 100%;

		margin: auto;
		cursor: pointer;
	}

	#description-text {
		color: white;
		float: left;
		margin-top: 0px;
	}
</style>
