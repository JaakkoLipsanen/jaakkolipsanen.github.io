<template>
	<div id="image-viewer-container" v-on:click="closeImage" >
		<div class='gallery-background'></div>

		<div id="image-container" >
			<div id="image-cc">
				<img id="image" src="{{ photoImagePath }}">
				<p id="description-text">{{ currentPhoto.Description }}</p>

				<div id="exif-div">
					<p>{{ "Shutter Speed: " + currentPhotoExif.ShutterSpeed + "s" }}</p>
					<p>{{ "Focal Length: " + currentPhotoExif.FocalLength + "mm" }}</p>
					<p>{{ "Aperture: " + currentPhotoExif.Aperture }}</p>
					<p>{{ "ISO: " + currentPhotoExif.ISO }}</p>

					<a v-show="currentPhotoExif.GpsLocation != 'unknown, unknown'" v-bind:href="'https://www.google.com/maps/place/' + currentPhotoExif.GpsLocation.replace(' ', '') + '/@' + currentPhotoExif.GpsLocation.replace(' ', '') + ',12z'" target="_blank">{{ "Location: " + currentPhotoExif.GpsLocation }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { PhotoType } from "./scripts/Gallery.js";
import { EXIF } from "./scripts/exif.js";

export default {
	data() {
		return {
			currentPhoto: null,
			gallerySource: null,
			currentPhotoExif: null
		};
	},

	ready: function() {
		const self = this;
		$("#image").load(function() {
			$("#image-cc").width("100%");
			$("#image-cc").height("100%");
			$("#image-cc").width(this.clientWidth);
			$("#image-cc").height(this.clientHeight);

			const parseDegrees = (degMinSec, ref) => {
				const DecimalPlaces = 5;
				const Divider = Math.pow(10, DecimalPlaces);

				const multiplier = ((ref === "W" || ref === "S") ? -1 : 1); // if the degree is in western or southern hemisphere, then make the value negative

				if(degMinSec === undefined) {
					return "unknown";
				}

				return (Math.round((degMinSec[0] + degMinSec[1] / 60 + degMinSec[2] / 60 / 60) * Divider) / Divider) * multiplier;
			};

			EXIF.getData(this, function() {
				self.currentPhotoExif = {
					Manufacturer: EXIF.getTag(this, "Make"),
					Model: EXIF.getTag(this, "Model"),

					DateTime: EXIF.getTag(this, "DateTimeOriginal"),
					FlashStatus: EXIF.getTag(this, "FlashStatus"),

					ExposureTime: EXIF.getTag(this, "ExposureTime"),
					FValue: EXIF.getTag(this, "FNumber"),
					ISO: EXIF.getTag(this, "ISOSpeedRatings"),
					ShutterSpeed: "1/" + Math.round(Math.pow(2, parseFloat(EXIF.getTag(this, "ShutterSpeedValue")))),
					Aperture: "f/" + Math.round(Math.pow(Math.sqrt(2), parseFloat(EXIF.getTag(this, "ApertureValue"))) * 10) / 10,
					FocalLength: EXIF.getTag(this, "FocalLength"),
					WhiteBalance: EXIF.getTag(this, "WhiteBalance"),
					BrightnessValue: EXIF.getTag(this, "BrightnessValue"),
					ExposureBias: EXIF.getTag(this, "ExposureBias"),

					GpsLocation: parseDegrees(EXIF.getTag(this, "GPSLatitude"), EXIF.getTag(this, "GPSLatitudeRef")) + ", " + parseDegrees(EXIF.getTag(this, "GPSLongitude"), EXIF.getTag(this, "GPSLongitudeRef")),
					GpsAltitude: EXIF.getTag(this, "GPSLatitudeRef")
				};

			}, false);
		});

		$(window).resize(function() {
			$("#image-cc").width("100%");
			$("#image-cc").height("100%");

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
	$exif-div-width: 200px;
	$exif-div-height: 108px;
	$exif-text-size: 14px;

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
		max-width: calc(87.5% - #{$exif-div-width});
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

	#exif-div {
		margin-left: calc(-#{$exif-div-width});
		margin-bottom: 0px;
		text-align: left;

		position: relative;
		bottom: calc(-100% + #{$exif-div-height});
		width: $exif-div-width;
		height: $exif-div-height;

		p {
			font-size: $exif-text-size;
			margin: 2px 0;
		}

		a {
			font-size: $exif-text-size;
		}
	}

	#exif-button {
		margin-bottom: -32px;
	}
</style>
