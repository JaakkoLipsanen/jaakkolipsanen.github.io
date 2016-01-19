<template>
	<div id="image-viewer-container" v-on:click="closeImage" >
		<div class='gallery-background'></div>

		<div id="image-container" >
			<div id="image-cc">
				<img id="image" src="{{ photoImagePath }}">
				<p id="description-text">{{ currentPhoto.Description }}</p>

			</div>
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

	ready: function() {
		$("#image").load(function() {
			$("#image-cc").width("100%");
			$("#image-cc").height("100%");
			$("#image-cc").width(this.clientWidth);
			$("#image-cc").height(this.clientHeight);

			console.log(this.clientWidth + " " + this.clientHeight);
		});

		$(window).resize(function() {
			console.log("pre: " + $("#image").outerWidth());
			$("#image-cc").width("100%");
			$("#image-cc").height("100%");

			console.log("post: " + $("#image").outerWidth());
			$("#image-cc").width($("#image").outerWidth());
			$("#image-cc").height($("#image").outerHeight());
		});
	},

	methods: {
		"closeImage": function() {
			$("#image-viewer-container").hide();
		}
	},

	computed: {
		photoImagePath: function() {
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

	#image-cc {
		width: 100%;
		height: 100%;

		margin: auto;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	#image {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;

		max-width: 100%;
		max-height: 100%;
	}

	#image-container {
		position: fixed;

		left: 0;
		right: 0;
		bottom: 0;
		top: 0;

		/* using calc because need to have fixed space for text etc */
		width: 85%;
		height: calc(95% - 64px);

		margin: auto;
		cursor: pointer;
	}

	#description-text {
		float: left;
		margin-top: -32px;

		/* clip and add ellipsis (...) if the text overflow */
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		overflow: hidden;
		text-align: left;
	}

	#exif-button {
		margin-bottom: -32px;
	}
</style>
