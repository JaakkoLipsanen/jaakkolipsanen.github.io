<template>
	<div class="cover-image-container">
		<image-component class="cover-image" v-if="image != null" :quality="imageQuality" :auto-size="false" :image="image"> </image-component>

		<!-- Vignette -->
		<div style="position: absolute; top: 0px; height: 100%; width: 100%;
			background-color: rgba(0, 0, 0, 0.25); box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.5);" ></div>

		<p class="main-text">  {{ mainText }}</p>
		<p class="sub-text" v-html="subText" ></p> <!-- use v-html because want to accept html tags (like line-break) -->
	</div>
</template>

<script>

import ImageComponent from "./Image.vue";

export default {
	components: {
		"image-component": ImageComponent
	},

	props: {
		image: {
			type: Object,
			required: true
		},

		mainText: {
			type: String,
			default: ""
		},

		subText: {
			type: String,
			default: ""
		}
	},

	data() {
		return {
			imageQuality: this.updateImageQuality()
		};
	},

	ready: function() {
		this.updateImageQuality();
		$(window).resize(() => {
			this.updateImageQuality();
		});
	},

	methods: {
		updateImageQuality: function() {
			this.imageQuality = window.matchMedia("(min-width: 800px)").matches ? "1080p" : "480p"; // no 720p middle ground :// not sure if good
			return this.imageQuality;
		}
	}
};
</script>

<style lang="sass" scoped>
	$cover-image-height: 85vh;
	.cover-image-container {
		position: fixed;
		height: $cover-image-height;
		top: 0;
		transform: translateZ(0);
		z-index: -1000;

		width: 100%;
	}

	.cover-image {
		 width: 100%;
		 height: $cover-image-height !important;

		 min-height: 200px;
		 background-size: cover;
		 background-position: 50% 45%;
		 background-repeat: no-repeat;
	}

	.main-text {
		position: absolute;
		margin: 0;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 95%;
		text-align: center;
		text-shadow: 1px 1px rgb(0, 0, 0);

		font-weight: 300;
		font-size: 34px;
		color: rgb(249, 249, 249);

		font-family: "Lato";
	}

	.sub-text {
		position: absolute;
		left: 50%;
		top: calc(100% - 54px);
		transform: translate(-50%, -50%);
		margin: auto;

		font-family: "Raleway";
		font-style: italic;
		font-weight: 300;
		font-size: 24px;

		color: rgb(205, 205, 205);
		text-align: center;
	}

	// in
	.cover-image > .blurry-image, .sharp-image {
		background-position: 50% 45%;
	}

</style>