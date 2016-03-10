<template>
	<div id="image-viewer-container" v-on:click="closeImage" >
		<div class='gallery-background'></div>

		<div id="image-container" >
			<div id="image-cc">
				<img id="image" src="{{ currentPhoto.FullPath('orig') }}">
				<p id="description-text">{{ currentPhoto.Description }}</p>

				<div id="exif-div">
					<p>{{ "Shutter Speed: " + currentPhotoExif.ShutterSpeed + "s" }}</p>
					<p v-if="currentPhotoExif.FocalLength35mmEquivalent != undefined">{{ "Focal Length (35mm equiv): " + currentPhotoExif.FocalLength35mmEquivalent + "mm" }}</p>
					<p>{{ "Aperture: " + currentPhotoExif.Aperture }}</p>
					<p>{{ "ISO: " + currentPhotoExif.ISO }}</p>
					<p>{{ "Date: " + currentPhotoExif.DateTime }}</p>

					<a v-show="currentPhotoExif.GpsLocation != 'unknown, unknown'" v-bind:href="'https://www.google.com/maps/place/' + currentPhotoExif.GpsLocation.replace(' ', '') + '/@' + currentPhotoExif.GpsLocation.replace(' ', '') + ',12z'" target="_blank">{{ "Location: " + currentPhotoExif.GpsLocation }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { EXIF } from "../scripts/exif.js";

export default {
	data() {
		return {
			currentPhoto: null,
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
				const exposureTime = parseFloat(EXIF.getTag(this, "ExposureTime"));
				const date = EXIF.getTag(this, "DateTimeOriginal").split(" ")[0];
				self.currentPhotoExif = {
					Manufacturer: EXIF.getTag(this, "Make"),
					Model: EXIF.getTag(this, "Model"),

					DateTime: date.split(":")[2] + "/" + date.split(":")[1] + "/" + date.split(":")[0],
					FlashStatus: EXIF.getTag(this, "FlashStatus"),

					ExposureTime: EXIF.getTag(this, "ExposureTime"),
					Aperture: "f/" + EXIF.getTag(this, "FNumber"),
					ISO: EXIF.getTag(this, "ISOSpeedRatings"),
					ShutterSpeed: ((exposureTime >= 1) ? Math.round(exposureTime) : ("1/" + Math.round(1 / exposureTime))),
					FocalLength: EXIF.getTag(this, "FocalLength"),
					FocalLength35mmEquivalent: EXIF.getTag(this, "FocalLengthIn35mmFilm"),
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
			$("html").css("overflow", "auto");
		}
	},

	events: {
		"show-photo": function(photo) {
			this.currentPhoto = photo;
			$("#image-viewer-container").show();
			$("html").css("overflow", "hidden");
		}
	}
};
</script>

<style lang="sass" scoped>
	$exif-div-width: 180px;
	$exif-div-height: 108px;
	$exif-text-size: 16px;

	#image-viewer-container {
		transition: opacity 0.3s ease-in-out;
		opacity: 1;
		position: absolute;
		z-index: 1000;
	}

	.gallery-background {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		background-color: rgb(24, 24, 24);
		opacity: 1;

		cursor: pointer
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
		max-width: calc(80.5% - #{$exif-div-width});
		height: calc(100%);

		margin: auto;
		cursor: pointer;
	}


	@media all and (max-width: 1279px) {
   	 	#image-container {
			max-width: 85% !important;
		}

		#exif-div {
			display: none !important;
		}
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
