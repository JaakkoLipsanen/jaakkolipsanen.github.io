<template>
	<div class="page-content-container">
		<slideshow class="slideshow" :images="slideshowImages" :quality="slideshowQuality"></slideshow>

		<p class="recent-posts-text">recent blog posts</p>
		<div class="divider"></div>
		
		<div>
			<a :href="getPostLink(post)" class="blog-post-block" v-for="post in blog.PostInfos" v-on:click="postClicked($event, post)">
				<div class="image-container">
					<image-component class="post-image" v-if="post.MainImage != null" :quality="'360p'" :auto-size="false" :image="post.MainImage"></image-component>
					<div class='image-color-overlay'> </div>
				</div>

				<h4 class="post-title"> {{ post.Title }} </h4>
				<h4 class="post-tour-info"> {{ post.Trip + ": " + post.DayRange.DisplayString }} </h4>
			</a>
		</div>

		<div class="rest-of-posts-link-container">
			<a href="/blog">rest of the blog posts ></a>
		</div>
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
			slideshowQuality: IsTouchDevice() ? "720p" : "orig" // todo, create & use "IsMobile" instead
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
	margin-bottom: 64px;

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
		padding-top: 64px !important;
	}
}

.slideshow {
	width: 100%;

	/* 66.66% for 3:2 aspect ratio */
	padding-bottom: 66.666%;
	margin-bottom: 24px;
}

.divider {
	width: 100%;
	border-bottom: solid 2px;
	color: rgb(64, 64, 64);
	margin: 0px;
	margin-top: 6px;
}

.recent-posts-text {
	font-family: "Raleway";
	font-weight: bold;
	font-size: 24px;

	margin-bottom: 0px;
	color: rgb(32, 32, 32);

	@media all and (max-width: 500px) {
		font-size: 20px;
	}
}

.rest-of-posts-link-container {
	text-align: right;
	margin-top: 8px;

	/* the actual link */
	a {
		font-family: 'Raleway';
		font-weight: 700;
		font-size: 18px;

		color:black;
		text-decoration: none;

		&:hover {
			opacity: 0.9;
			color: rgb(72, 72, 72);
		}
	}
}

$blog-post-block-margin: 24px;
.blog-post-block {
	text-align: center;
	cursor: pointer;

	display: inline-block;
	margin: 16px $blog-post-block-margin;
	text-decoration: none;

	&:hover > div > div {
		background-color: rgba(0, 0, 0, 0.1) !important;
	}

	@media all and (min-width: 2276px) {
		width: calc(100% / 3 - #{$blog-post-block-margin} * 1.34);
		&:nth-child(3n + 1) {
			margin-left: 0px;
		}

		&:nth-child(3n) {
			margin-right: 0px;
		}
	}


	@media all and (min-width: 958px) and (max-width: 2275px) {
		width: calc(50% - #{$blog-post-block-margin});
		&:nth-child(2n + 1) {
			margin-left: 0px;
		}

		&:nth-child(2n) {
			margin-right: 0px;
		}

		&:nth-child(n + 5) {
			display: none;
		}
	}

	@media all and (max-width: 957px) {
		width: 100%;
		margin-left: 0px;
		margin-right: 0px;

		&:nth-child(n + 4) {
			display: none;
		}
	}
}

.post-image {
	width: 100% !important;
	padding-bottom: 66.66% !important;
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

.post-title, .post-tour-info {
	font-family: "Raleway";
	margin: 0px;
	margin-top: 4px;
	text-align: left;
	color: black;

	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.post-tour-info {
	font-weight: 500;
	margin-top: 0px;
	text-decoration: none;
}

</style>
