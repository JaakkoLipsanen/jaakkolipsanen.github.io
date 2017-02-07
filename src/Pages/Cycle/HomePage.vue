<template>
	<div class="page-content-container">
		<slideshow class="slideshow" :images="slideshowImages" :quality="slideshowQuality"></slideshow>
	</div>
</template>

<script>

import Slideshow from "../../Components/Slideshow.vue";
import { Photo } from "../../scripts/Photo.js";
import { Shuffle, IsTouchDevice } from "../../scripts/MiscHelper.js";

export default {
	data() {
		return {
			slideshowImages: Shuffle([
				new Photo("/assets/cycle/blog/posts/and-back-again", "1060788.jpg"),
				new Photo("/assets/cycle/blog/posts/angel-has-landed", "1070479.jpg"),
				new Photo("/assets/cycle/blog/posts/colorado", "1100202.jpg"),
				new Photo("/assets/cycle/blog/posts/day-one", "1140612~2.jpg"),
				new Photo("/assets/cycle/blog/posts/down-and-back-up-again", "1180150~2.jpg"),
				new Photo("/assets/cycle/blog/posts/enter-capitol", "1080602.jpg"),
				new Photo("/assets/cycle/blog/posts/lockhart-basin", "1090621.jpg"),
				new Photo("/assets/cycle/blog/posts/negev-mitzpe-ramon-loop", "1160850~2.jpg"),
				new Photo("/assets/cycle/blog/posts/negev-mitzpe-ramon-loop", "1170226~2.jpg"),
				new Photo("/assets/cycle/blog/posts/wadi-rum", "1170842~2.jpg"),
				new Photo("/assets/cycle/blog/posts/through-west-bank-to-jerusalem", "1180639~2.jpg"),
				new Photo("/assets/cycle/blog/posts/the-green-israel", "1140788~2.jpg"),
				new Photo("/assets/cycle/blog/posts/ruby-beach-and-rest-of-washington", "1120610.jpg"),
				new Photo("/assets/cycle/blog/posts/oregon-coast-part-1", "P1120983.JPG"),
				new Photo("/assets/cycle/blog/posts/lost-coast", "P1130350.JPG"),
				new Photo("/assets/cycle/blog/posts/judean-desert-and-the-dead-sea", "1140983~3.jpg")
			]),

			// lower quality would be better for bandwidth etc, but since the slideshow moves to the next pic
			// only when it gets loaded, it doesnt really matter. I think 720p/1080p is good
			slideshowQuality: IsTouchDevice() ? "720p" : "1080p" // todo, create & use "IsMobile" instead
		};
	},

	components: {
		"slideshow": Slideshow
	},

	ready: function() {
	},
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

.display-img {
	width: 50%;
	margin: auto;
	display: block;
}

.page-content-container {
	margin: auto;
	padding-top: 118px;
	margin-bottom: 0px;

	@media all and (max-width: 615px) {
		padding-top: 72px !important;
	}
}

.slideshow {
	@media all and (min-width: 1920px) {
		width: 50%;
	}

	@media all and (min-width: 1578px) and (max-width: 1919px) {
		width: 960px;
	}

	@media all and (min-width: 1420px) and (max-width: 1577px) {
		width: calc(100% - 617px);
	}

	@media all and (min-width: 1081px) and (max-width: 1419px) {
		width: calc(802px);
	}

	@media all and (min-width: 864px) and (max-width: 1080px) {
		width: calc(100% - 278px);
	}
	
	@media all and (min-width: 616px) and (max-width: 863px) {
		width: 585px;
	}


	@media all and (max-width: 615px) {
		width: calc(95%);
	}
	max-height: calc(100% - 118px);
}
 
</style>
