<template>
	<div class="page-content-container">

		<!-- Main Image -->
		<div class="main-image-container">
			<div class="main-image" style="background-image: url({{ currentPost.MainImage.DefaultHDPath }})"></div>

			<!-- Vignette -->
			<div style="position: absolute; top: 0px; height: 100%; width: 100%;
				background-color: rgba(0, 0, 0, 0.25); box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);" ></div>

			<p class="main-image-title">  {{ currentPost.Title.toUpperCase() }}</p>
			<p class="main-image-day-range" >{{ currentPost.DayRange.DisplayString }}</p>
		</div>
		<div class="main-image-container-spacer"></div>
		<div class="blog-content-background">
			<div class="blog-content-container">
				<div class="blog-post-container">

					<!-- Blog post content -->
					<div class="blog-post-content-container" >
						<div class="content-block" v-for="block in currentPost.ContentBlocks">
							<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
							<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
							<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
							<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>

								<div style="position: relative; height: 0; background-color: rgb(215, 215, 215);  padding-bottom: {{ calculateImagePadding(block.Image) }}">
									<img photo="{{ block.Image }}" :srcset="block.Image.MultiPath" sizes="(max-width: 660px) 100vw, (max-width: 1100px) 660px, 60vw" style="width: 100%; cursor: pointer;" v-on:click="imageClicked(block.Image)">
								</div>
								<div v-if="block.Image.Text != '' "style="width: 100%; height: auto;">
									<p style="margin: 0; font-family: 'Raleway'; font-style: italic";>{{ block.Image.Text }}</p>
								</div>
							</div>
						</div>


					</div>

					<cycle-map v-if="CycleRoutePath != undefined && !DayRange.IsZeroDay" class="route-map" theme="light" :route-path="CycleRoutePath" :day-range="DayRange"></cycle-map>
				 </div>

				 <!-- Side bar -->
				 <div class="sidebar">
					 <h3> Other Blog Posts </h3>

					 <h4 class="sidebar-tour-title" v-for="tour in tours"> {{ tour.name }} <span style="font-size: 12px"> ({{ tour.year }}) </span>
						 <p class="sidebar-post" v-for="post in  getBlogPostsForTour(tour)" v-on:click="openPost(post)" v-bind:class="{ 'selected-sidebar-post': post.Title == currentPost.Title }"> {{ post.Title }} </p>
						 <p v-if="getBlogPostsForTour(tour).length == 0" style="font-style: italic "> no posts from this tour ! </p>
					 </h4>
				 </div>
			</div>
		</div>

		<image-viewer style="display: none"></image-viewer>
	</div>
</template>

<script>

import { BlogSource, BlogPost, BlogQuery } from "../../scripts/Blog.js";
import { CycleTourData } from "../../scripts/CycleTourData.js";

import ImageGroup from "../../Components/ImageGroup.vue";
import ImageViewer from "../../Components/ImageViewer.vue";
import CycleMap from "../../Components/CycleMap.vue";

import Vue from "vue";

export default {
	data() {
		return {
			blog: null,
			currentPost: null,

			tours: CycleTourData.Tours.slice().reverse(),
		};
	},

	components: {
		"image-group": ImageGroup,
		"cycle-map": CycleMap,
		"image-viewer": ImageViewer
	},

	ready: function() {
		let data = this;
		BlogSource.FromFile("assets/cycle/blog/posts.txt").then(async blog => {
			data.blog = blog.CreateQuery();
			data.blog.PostInfos.reverse(); // make the post infos go from newest to oldest

			data.currentPost = await data.blog.GetBlogPostByName(data.$root.CurrentState().PostName);
		});
	},

	methods: {
		getBlogPostsForTour: function(tour) {
			return this.blog.PostInfos.filter(post => post.Trip == tour.shortName);
		},

		getLoadStyleByIndex: function(index) {
		/*	if(index == 0) { return 0; }
			else if(index < 3) { return 1; } */

			return 2;
		},

		openPost: async function(post) {
			this.currentPost = await this.blog.GetBlogPostByPostInfo(post);
			window.scrollTo(0, 0);
		},

		imageClicked: function(photo) {
			this.$broadcast("show-photo", photo);
		},

		calculateImagePadding: function(image) {
			return (1 / image.AspectRatio * 100) + "%";
		}
	},

	computed: {
		CycleRoutePath: function() {
			if(!this.currentPost) {
				return undefined
			}

			return "assets/cycle/routes/" + this.currentPost.TripUrlString + "/route.txt";
		},

		DayRange: function() {
			if(!this.currentPost) {
				return undefined
			}

			return this.currentPost.DayRange;
		}
	},

	events: {
		'opening-post': function(element) {
			this.$broadcast('close-blog');
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

	/* one big thing in this css file that may confuse is the main-image background attachement thing. if you use background-attachment: fixed,
	/* chrome will re-paint the image everytime the window is scrolled which can cause some major lag (firefox works fine). so, to work around it,
	/* i had to change main-image-container to be position: fixed, add transform: translateZ(0) (to cause it render in another layer or something)
	/* and some other possibly a bit confusing things. https://mention.com/blog/building-a-beautiful-homepage-how-we-nailed-down-chrome-performance-rendering-issues/ */

	.route-map {
		width: 100%  !important;
		max-height: 60vh !important;
		color: black !important;
	}

	$main-image-height: 85vh;
	.main-image-container {
		position: fixed;
		top: 0;
		transform: translateZ(0);
		z-index: -1000;

		width: 100%;
	}

	.main-image-container-spacer {
		margin-top: $main-image-height;
	}

	.main-image {
		 width: 100%;
		 height: $main-image-height;

		 min-height: 200px;
		 background-size: cover;
		 background-position: 50% 45%;
	/*	 background-attachment: fixed; */
		 background-repeat: no-repeat;
	}

	.main-image-title {
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

	.main-image-day-range {
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
	}

	.page-content-container {
		width: 100%;
		height: auto;
		margin: auto;

		margin-bottom: 48px;
	}

	.blog-content-background {
		width: 100%;
		background-color: white;
	}

	.blog-content-container {
		width: 100%;
		max-width: 1000px;
		margin: auto;
		margin-top: 8px;

		margin-left: calc((100% - 700px) / 2);
	}

	@media all and (min-width: 837px) and (max-width: 1250px) {
		.blog-content-container {
			margin: auto !important;
		}
	}

	@media all and (max-width: 836px) {
		.blog-content-container {
			width: auto;
			margin: 12px !important;
		}

		.sidebar {
			display: block !important;
			margin: auto !important;
		}
	}

	$side-bar-width: 300px;
	.blog-post-container {
		display: table-cell;
		width: 100%;

		.blog-post-title {
			text-align: center;
			margin-bottom: 8px;

			font-family: "Lato";
			font-weight: 500;
			font-size: 24px;
		}

		.blog-post-title-subtext {
			text-align: center;
			font-size: 15px;
			margin-top: 0px;


			font-family: "Lato";
			font-style: italic;
			font-weight: 500;
		}

		.blog-post-content-container {
			margin: 8px;

			p {
				color: black;
				font-weight: 400;
				font-size: 17px;
				font-family: "Raleway";
			}

			.image-block {
				text-align: center;
			}

			.content-block {
				margin: 16px 0;
			}

			.header-block {
				font-family: "Lato";
				font-weight: 300;
			}
		}
	}

	.sidebar {
		width: $side-bar-width;
		min-width: $side-bar-width;

		display: table-cell;
		vertical-align: top;

		p {
			color: black;

			font-size: 14px;
			font-weight: 300;
			font-family: "Lato";

			margin: 4px 0px;
			margin-left: 24px;

			&.sidebar-post {
				cursor: pointer;
				&:hover {
					font-weight: 400;
				}
			}
		}

		.sidebar-tour-title {
			margin-bottom: 10px;
		}

		h4, h3 {
			font-family: "Raleway";
			font-size: 14px;
			font-weight: 600;

			margin-left: 8px;
			margin-bottom: 6px;
			margin-top: 6px;
		}

		h3 {
			font-size: 18px;
			margin-top: 16px;
			margin-bottom: 14px;
		}

		.selected-sidebar-post {
			/* make the selected post in the sidebar bolded */
			font-weight: 600 !important;
			font-style: italic;
		}
	}

</style>
