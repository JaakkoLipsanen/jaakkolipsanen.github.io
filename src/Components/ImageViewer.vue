<template>
	<div id="image-viewer-container">
		<div class='gallery-background'></div>
		<img class="close-button" src="/icons/close-black.png" v-on:click="OnCloseButtonClicked()">


		<div id="image-container" >
			<div id="image-cc">
				<image-component v-if="currentPhoto" id="image" :image="currentPhoto" :quality="ImageQuality" :auto-size="false" :background-size="'contain'" :background-color="'transparent'" v-on:click="ChangeImageByIndex(CurrentImageIndex + 1)"></image-component>
				<p v-if="currentPhoto" class="photo-text"> {{ currentPhoto.Text }} </p>

				<div class="photo-controls">
					<div class="move-previous-button triangle-left" :class="{ disabled: CurrentImageIndex == 0 }" style="transform: rotate(180)" v-on:click="ChangeImageByIndex(CurrentImageIndex - 1)"> </div>
					<div class="move-next-button triangle-right" :class="{ disabled: CurrentImageIndex == TotalImageCount - 1 }"  v-on:click="ChangeImageByIndex(CurrentImageIndex + 1)"> </div>
					<p class="photo-index"> {{ (CurrentImageIndex + 1) + '/' + TotalImageCount }} </p>
				</div>

				<div v-if="currentPhotoExif" id="exif-div">
					<p>{{ "Shutter Speed: " + currentPhotoExif.ShutterSpeed + "s" }}</p>
					<p v-if="currentPhotoExif.FocalLength35mmEquivalent != undefined">{{ "Focal Length (35mm equiv): " + currentPhotoExif.FocalLength35mmEquivalent + "mm" }}</p>
					<p>{{ "Aperture: " + currentPhotoExif.Aperture }}</p>
					<p>{{ "ISO: " + currentPhotoExif.ISO }}</p>
					<p>{{ "Date: " + currentPhotoExif.DateTime }}</p>

					<a class="image-location-link" v-if="currentPhotoExif.GpsLocation != 'unknown, unknown'" v-bind:href="'https://www.google.com/maps/place/' + currentPhotoExif.GpsLocation.replace(' ', '') + '/@' + currentPhotoExif.GpsLocation.replace(' ', '') + ',12z'" target="_blank">{{ "Location: " + currentPhotoExif.GpsLocation }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ImageComponent from "./Image.vue";

export default {
	components: {
		"image-component": ImageComponent
	},

	props: {
		photoStream: Object
	},

	data() {
		return {
			currentPhoto: null,
			currentPhotoExif: null
		};
	},

	methods: {
		OnCloseButtonClicked: function() {
			$("#image-viewer-container").hide();
			$("html").css("overflow", "auto");

			this.currentPhoto = null;
			this.currentPhotoExif = null;
		},

		OpenImage: function(photo, photostream) {
			this.currentPhoto = photo;
			$("#image-viewer-container").show();
			$("html").css("overflow", "disabled");

		},

		ChangeImageByIndex: function(index) {
			if(index < 0 || index >= this.TotalImageCount) {
				return;
			}

			this.currentPhoto = this.photoStream.Photos[index];
		},

		SetupExif: function() {
			/*
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
				const dateTime = EXIF.getTag(this, "DateTimeOriginal");
				const date = (dateTime === undefined) ? "" : dateTime.split(" ")[0];
				self.currentPhotoExif = {
					Manufacturer: EXIF.getTag(this, "Make"),
					Model: EXIF.getTag(this, "Model"),

					DateTime: date.split(":").length >= 2 ? (date.split(":")[2] + "/" + date.split(":")[1] + "/" + date.split(":")[0]) : "unknown",
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
			*/
		}
	},

	computed: {
		CurrentImageIndex: function() {
			return (this.photoStream === null || this.currentPhoto === null) ? 0 : (this.photoStream.IndexOf(this.currentPhoto));
		},

		TotalImageCount: function() {
			return (this.photoStream === null) ? 0 : this.photoStream.Count;
		},

		ImageQuality: function() {
			return "1080p"; // todo: 720p on mobile, orig on desktop? or a persistent button between 720p/orig/1080p
		}
	},

	events: {
		"show-photo": function(photo) {
			this.OpenImage(photo);
		}
	}
};
</script>

<style lang="sass" scoped>

	#image-viewer-container {
		transition: opacity 0.3s ease-in-out;
		opacity: 1;
		position: absolute;
		z-index: 1000;

		display: none;
	}

	.gallery-background {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		background-color: white;
		opacity: 1;
	}

	#image-cc {
		width: 100%;
		height: calc(100% - 24px);

		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	#image {
		position: absolute;
		top: 0;
		bottom: 64px;
		left: 0;
		right: 0;
		margin: auto;

		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}

	#image-container {
		position: fixed;

		left: 0;
		right: 0;
		bottom: 0;
		top: 0;

		/* using calc because need to have fixed space for text etc OLD: */
		max-width: 95%;
		height: calc(100%);

		margin: auto;
	}

	.close-button {
		float:left;
		position: fixed;
		right: 8px;
		top: 8px;
		width: 26px;
		height: 26px;
		opacity: 0.65;
		transition: opacity 0.3s, transform 0.3s;
		cursor: pointer;
		z-index: 100000;

		&:hover {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.photo-controls {
		position: absolute;
		bottom: 8px;
		width: 100%;
	}

	.photo-index {
		position: absolute;
		float: left;
		margin-left: 50%;
		transform: translateX(-50%);
		font-family: "Lato";

		/* same as prev/next triangle height */
		line-height: 24px;
		margin-top: 0;
		margin-bottom: 0;
	}

	.disabled {
		opacity: 0.4 !important;
		cursor: default !important;
	}

	.move-previous-button {
		margin-left: calc(50% - 48px);
		display: inline-block;
		position: absolute;
		float: left;
		transform: translateX(-50%);
		cursor: pointer;
		opacity: 0.65;

		&:hover:not(.disabled) {
			opacity: 1;
		}
	}

	.move-next-button {
		margin-left: calc(50% + 48px);
		display: inline-block;
		position: absolute;
		float: left;
		transform: translateX(-50%);
		cursor: pointer;
		opacity: 0.65;

		&:hover:not(.disabled) {
			opacity: 1;
		}
	}

	.triangle-right {
		width: 0;
		height: 0;
		border-top: 12px solid transparent;
		border-bottom: 12px solid transparent;

		border-left: 18px solid rgba(0, 0, 0, 1);
		border-radius: 4px;
	}

	.triangle-left {
		width: 0;
		height: 0;
		border-top: 12px solid transparent;
		border-bottom: 12px solid transparent;

		border-right: 18px solid  rgba(0, 0, 0, 1);
		border-radius: 4px;
	}

	.photo-text {
		position: absolute;
		bottom: 0px;
		text-align: center;
		font-family: "Raleway";
		font-style: italic;

		width: 90%;
		left: 5%;
	}

	@media all and (max-width: 1279px) {
   	 	#image-container {
			max-width: 100% !important;
		}

		#exif-div {
			display: none !important;
		}
    }


	$exif-div-width: 280px;
	$exif-div-height: 116px;
	$exif-text-size: 16px;

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
