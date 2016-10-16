<template>
	<div class="page-content-container">

		<cover-image :image="CoverImage" :main-text="CoverImageMainText" :sub-text="CoverImageSubText"></cover-image>

		<div class="blog-content-background">
			<div class="blog-content-container">
				<div class="blog-post-container">

					<!-- Blog post content -->
					<div class="blog-post-content-container" >
						<div class="content-block" v-for="block in (currentPost ? currentPost.ContentBlocks : [])">
							<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
							<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
							<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
							<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
								<image-component :image="block.Image" v-on:click="imageClicked(block.Image)"> </image-component>


								<div v-if="block.Image.Text != '' "style="width: 100%; height: auto;">
									<p style="margin: 0; font-family: 'Raleway'; font-style: italic";>{{ block.Image.Text }}</p>
								</div>
							</div>
						</div>


					</div>

					<cycle-map v-if="CycleRoutePath != undefined && !DayRange.IsZeroDay" class="route-map" theme="light" :force-night-markers-visible="true" :route-path="CycleRoutePath" :day-range="DayRange"></cycle-map>
				 </div>

				 <!-- Side bar -->
				 <div class="sidebar">
					 <h3> Other Blog Posts </h3>

					 <h4 class="sidebar-tour-title" v-for="tour in tours"> {{ tour.name }} <span style="font-size: 12px"> ({{ tour.year }}) </span>
						 <a :href="getSidebarLink(post)" class="sidebar-post" v-for="post in getBlogPostsForTour(tour)" v-on:click="sidebarLinkClicked($event, post)" v-bind:class="{ 'selected-sidebar-post': currentPost && post.Title == currentPost.Title }"> {{ post.Title }} </a>
						 <p v-if="getBlogPostsForTour(tour).length == 0" style="font-style: italic "> no posts from this tour ! </p>
					 </h4>
				 </div>
			</div>
		</div>

		<image-viewer :photo-stream="BlogPostPhotoStream"></image-viewer>
	</div>
</template>

<script>

import { BlogSource, BlogPost, BlogQuery } from "../../scripts/Blog.js";
import { PhotoStream } from "../../scripts/PhotoStream.js";
import { CycleTourData } from "../../scripts/CycleTourData.js";

import ImageGroup from "../../Components/ImageGroup.vue";
import ImageComponent from "../../Components/Image.vue";
import CoverImage from "../../Components/CoverImage.vue";
import ImageViewer from "../../Components/ImageViewer.vue";
import CycleMap from "../../Components/CycleMap.vue";

import Vue from "vue";

export default {
	data() {
		return {
			blog: null,
			currentPost: null,

			tours: CycleTourData.Tours.slice().reverse(), // slice so make a copy of the original array
		};
	},

	components: {
		"image-group": ImageGroup,
		"image-component": ImageComponent,
		"cover-image": CoverImage,
		"cycle-map": CycleMap,
		"image-viewer": ImageViewer
	},

	ready: function() {
		let data = this;
		BlogSource.FromFile("/assets/cycle/blog/posts.txt").then(async blog => {
			data.blog = blog.CreateQuery();
			data.blog.PostInfos.reverse(); // make the post infos go from newest to oldest

			data.currentPost = await data.blog.GetBlogPostByName(data.$root.CurrentState().PostName);
		});
	},

	methods: {
		getBlogPostsForTour: function(tour) {
			return this.blog ? this.blog.PostInfos.filter(post => post.Trip === tour.shortName) : [];
		},

		getSidebarLink: function(post) {
			return "/blog/" + post.Name;
		},

		sidebarLinkClicked: async function(event, post) {
			if(event.which !== 1) return; // if middle click or right click, then let the <a> do it's own work

			event.preventDefault();
			this.currentPost = await this.blog.GetBlogPostByPostInfo(post);
			this.$root.ChangeURL("/blog/" + post.Name, { PostName: post.Name });
			window.scrollTo(0, 0);
		},

		imageClicked: function(photo) {
			this.$broadcast("show-photo", photo);
		},
	},

	computed: {
		CycleRoutePath: function() {
			if(!this.currentPost) {
				return undefined
			}

			return "/assets/cycle/routes/" + this.currentPost.TripUrlString + "/route.txt";
		},

		DayRange: function() {
			if(!this.currentPost) {
				return undefined
			}

			return this.currentPost.DayRange;
		},

		CoverImage: function() {
			if(this.currentPost === null) {
				return null;
			}

			return this.currentPost.MainImage;
		},

		CoverImageMainText: function() {
			if(this.currentPost === null) {
				return "";
			}

			return this.currentPost.Title.toUpperCase();
		},

		CoverImageSubText: function() {
			if(this.currentPost === null) {
				return "";
			}

			return  this.currentPost.DayRange.DisplayString +
					"<br>" + // line break
					this.currentPost.Trip;
		},

		BlogPostPhotoStream: function() {
			if(this.currentPost == null) return null;

			return PhotoStream.FromBlogPost(this.currentPost);
		},
	},

	events: {
		'opening-post': function(element) {
			this.$broadcast('close-blog');
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

	.route-map {
		width: 100%  !important;
		max-height: 60vh !important;
		color: black !important;
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
				cursor: pointer;
			}

			.content-block {
				margin: 16px 0;
			}

			.header-block {
				font-family: "Raleway";
				font-weight: 400;
				font-size: 30px;
			}
		}
	}

	.sidebar {
		width: $side-bar-width;
		min-width: $side-bar-width;

		display: table-cell;
		vertical-align: top;

		p, a {
			color: black;
			display: block;

			font-size: 14px;
			font-weight: 300;
			font-family: "Lato";

			margin: 4px 0px;
			margin-left: 24px;
			text-decoration: none;

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
