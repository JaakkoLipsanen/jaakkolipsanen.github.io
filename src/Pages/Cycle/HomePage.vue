<template>
	<div class="page-content-container">
		<slideshow class="slideshow" :images="slideshowImages" :quality="slideshowQuality"></slideshow>
		<p style="font-weight: bold;width: 100%; font-size: 24px; margin-bottom: 0px; color: rgb(32, 32, 32); font-family: 'Raleway'">recent blog posts</p>
		<div style="width: 100%;border-bottom: solid 2px;margin: 0px;margin-top: 6px;color: rgb(64, 64, 64);"></div>
		
		<a :href="getPostLink(post)" class="blog-post-block" v-for="post in blog.PostInfos" v-on:click="postClicked($event, post)">
			<div class="image-container">
				<image-component class="post-image" v-if="post.MainImage != null" :quality="'360p'" :auto-size="false" :image="post.MainImage"></image-component>
				<div class='image-color-overlay'> </div>
			</div>

			<h4 class="post-title"> {{ post.Title }} </h4>
			<h4 class="post-tour-info"> {{ post.Trip + ": " + post.DayRange.DisplayString }} </h4>
		</a>
	</div>
</template>

<script>

import Slideshow from "../../Components/Slideshow.vue";
import { Photo } from "../../scripts/Photo.js";
import { Shuffle, IsTouchDevice } from "../../scripts/MiscHelper.js";

import { BlogSource } from "../../scripts/Blog.js";
import ImageComponent from "../../Components/Image.vue";

export default {
	data() {
		return {
			blog: null,
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
		"slideshow": Slideshow,
		"image-component": ImageComponent
	},

	ready: function() {
		const data = this;
		BlogSource.FromFile("/assets/cycle/blog/posts.txt").then(blog => {
			data.blog = blog.CreateQuery(post => true);
			data.blog.PostInfos.reverse();
			data.blog.PostInfos = data.blog.PostInfos.slice(0, 6);
		});
	},

	methods: {
		postClicked: function(event, post) {
			if(event.which !== 1) return; // if middle or right click, then let the link do it's own work

			event.preventDefault();
			this.$root.ChangePage("blog-post-page", "/blog/" + post.URL, { PostName: post.Name });
		},

		getPostLink: function(post) {
			return "/blog/" + post.Name;
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false scoped>

.page-content-container {
	margin: auto;
	padding-top: 118px;
	margin-bottom: 0px;

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
		padding-top: 72px !important;
	}
}

.slideshow {
	width: 100%;

	/* 75% because the images are all 4:3 */
	padding-bottom: 75%;
	margin-bottom: 32px;
}







.blog-post-block {
	width: 400px;
	text-align: center;
	cursor: pointer;

	display: inline-block;
	margin: 16px 34px;
	text-decoration: none;
}

.post-title, .post-tour-info {
	font-family: "Raleway";
	margin: 0px;
	margin-top: 4px;
	text-align: left;
	color: black;
}

.post-tour-info {
	font-weight: 500;
	margin-top: 0px;
	text-decoration: none;
}

.introduction-text {
	width: 90%;
	margin: 16px auto;

	text-align: center;
}

.blog-post-block:hover > div > div {
	background-color: rgba(0, 0, 0, 0.1) !important;

	h1 {
		color: white !important;
	}

	h3 {
		color: white !important;
	}
}


@media all and (max-width: 952px) {
	.blog-post-block {
		width: 85% !important;
		margin: 16px 0 !important;
		text-align: center;
	}
}

.blog-post-block-background {
	width: 100%;
	height: 100% !important; background-position: center; background-size: cover;
}

.blog-list-page-container {
	margin: auto;
	margin-top: 8px;
	margin-bottom: 32px;
	width: 100%;
	max-width: 1600px;

	text-align: center;

	@media all and (max-width: 615px) {
		padding-top: 54px;
	}

	@media all and (min-width: 616px) {
		padding-top: 96px;
	}
}


.image-container {
	width: 100%;
	padding-bottom: 66%;
}

.image-color-overlay {
	position: absolute;
	width: 100%;
	padding-bottom: 66%;
	top: 0;

	background-color: rgba(0, 0, 0, 0.3);
	transition: background-color 0.2s ease-in-out;
}

 
</style>
