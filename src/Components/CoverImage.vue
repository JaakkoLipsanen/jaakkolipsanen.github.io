<template>
	<div>
		<div class="cover-image-container">
			<image-component v-if="image" class="cover-image" :quality="imageQuality" :auto-size="false" :image="image"> </image-component>

			<!-- Vignette -->
			<div style="position: absolute; top: 0px; height: 100%; width: 100%;
				background-color: rgba(0, 0, 0, 0.25); box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.5);" ></div>

			<p class="main-text">  {{ mainText }}</p>
			<p class="sub-text" v-html="subText" ></p> <!-- use v-html because want to accept html tags (like line-break) -->
		</div>

		<div class="cover-image-container-spacer"></div>
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

		this.setupHeight();
	},

	methods: {
		updateImageQuality: function() {
			this.imageQuality = window.matchMedia("(min-width: 800px)").matches ? "1080p" : "480p"; // no 720p middle ground :// not sure if good
			return this.imageQuality;
		},

		// on many mobile browsers, like chrome on android, the navbar disappear/reappears when the user scrolls up or down
		// this causes the window size to change and causes a "jump" on all elements that use "vh" units. this function fixs it, although pretty hack-ily
		setupHeight: function() {
			let previousWindowHeight = $(window).height();
			let windowHeightOnPreviousHeightUpdate = $(window).height();

			const ImageHeightInVH = 0.85; // copy this from CSS. must keep also in CSS to not have a jump on page load // 0...1 -> 0...100vh
			const updateHeight = () => {
				const newHeight = $(window).height() * ImageHeightInVH;
				$(".cover-image-container").css("height", newHeight + "px");
				$(".cover-image-container-spacer").css("margin-top", newHeight + "px");

				windowHeightOnPreviousHeightUpdate = $(window).height();
			};

			$(window).resize(() => {
				const MinHeightChange = 40;
				const MaxHeightChange = 103;

				const windowHeight = $(window).height();

				// okay... so if the height difference is less than MinHeightChange (40), update the cover image size always.
				// if it is more than MaxHeightChange (103), then also update the cover image size
				// otherwise, we expect that the height change is caused by navbar disappearing/reappearing
				// TODO: we could do that if there is any width change, then always update cover image height?
				const totalDifference = Math.abs(windowHeightOnPreviousHeightUpdate - windowHeight);
				const resizeDifference = Math.abs(windowHeight - previousWindowHeight);
				if(resizeDifference < MinHeightChange || totalDifference > MaxHeightChange) {
					updateHeight();
				}

				previousWindowHeight = windowHeight;
			});

			updateHeight();
		}
	}
};
</script>

<style lang="sass" scoped>
	// the height will be programmitcally be changed to "px" units in setupHeight(). this must be kept
	// here as well, JS-only solution causes a jump on page load
	$cover-image-height: 85vh;
	.cover-image-container {
		position: fixed;
		height: $cover-image-height;
		top: 0;
		transform: translateZ(0);
		z-index: -1000;

		width: 100%;
	}

	.cover-image-container-spacer {
		margin-top: $cover-image-height;
	}

	.cover-image {
		 width: 100%;
		 height: 100%;

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
