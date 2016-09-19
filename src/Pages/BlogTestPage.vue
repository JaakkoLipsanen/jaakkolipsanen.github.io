<template>
	<div class="page-content-container">
		<div class="blog-post-container">
			<h1 class="blog-post-title"> {{ currentPost.Title }} </h1>
			<h2 class="blog-post-title-subtext"> {{ currentPost.Trip + ": Days " + currentPost.DayRange }} </h2>

			<div class="blog-post-content-container" >
				<div class="content-block" v-for="block in currentPost.ContentBlocks">
					<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
					<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
					<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
					<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
						<!-- style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.35);"> -->

						<div style="padding-bottom: {{ calcImgPaddingFromBlock(block) }}; position: relative; height: 0; background-color: rgb(44, 44, 44)">
							<img photo="{{ block.Image }}" :srcset="block.Image.MultiPath" sizes="(max-width: 660px) 100vw, (max-width: 1100px) 660px, 60vw" style="width: 100%;" v-on:click="imageClicked(block.Image)">
						</div>
						<div v-if="block.Image.Text != '' "style="width: 100%; height: auto;">
							<p style="margin: 0; font-family: 'Lato'; font-style: italic";>{{ block.Image.Text }}</p>
						</div>
					</div>
				</div>


			</div>

		 </div>
		<div class="sidebar">
			<h4> - Western USA '16 </h4>
			<p v-for="post in blog.PostInfos" v-on:click="openPost(post)" v-bind:class="{ 'selected-sidebar-post': post.Title == currentPost.Title }"> {{ post.Title }} </p>
			<h4> + Europe '15 </h4>
			<h4> + Winter in Spain '14 </h4>
			<h4> + Sweden To Belgium '14 </h4>
		</div>

	</div>
</template>

<script>;
import { BlogSource, BlogPost, BlogQuery } from "../scripts/Blog.js";
import BlogPostView from "../Components/BlogPostView.vue";
import ImageGroup from "../Components/ImageGroup.vue";
import Vue from "vue";

export default {
	data() {
		return {
			blog: null,
			currentPost: null,
		};
	},

	components: {
		"blog-post": BlogPostView,
		"image-group": ImageGroup,
	},

	ready: function() {
		let data = this;
		BlogSource.FromFile("/cycle/blog/posts.txt").then(async blog => {
			data.blog = blog.CreateQuery();
			data.blog.PostInfos.reverse(); // make the post infos go from newest to oldest

			data.currentPost = await data.blog.GetBlogPostByIndex(2);
		});
	},

	methods: {
		getLoadStyleByIndex: function(index) {
		/*	if(index == 0) { return 0; }
			else if(index < 3) { return 1; } */

			return 2;
		},

		openPost: async function(post) {
			this.currentPost = await this.blog.GetBlogPostByPostInfo(post);
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

	.page-content-container {
		height: auto;

		width: 60%;
		margin: auto;

		/* such a big margin-top because navbar doesn't affect layout */
		margin-top: 128px;
		margin-bottom: 48px;
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
				font-size: 16px;
				font-family: "Open Sans";
			}

			.image-block {
				text-align: center;
			}

			.content-block {
				margin: 16px 0;
			}
		}
	}

	@font-face {
		font-family: "Alte Din";
		src: url("/assets/fonts/Alte Din.ttf") format("truetype");

	}

	.sidebar {
		width: $side-bar-width;
		min-width: $side-bar-width;

		display: table-cell;
		vertical-align: top;

		p {
			color: black;
			cursor: pointer;

			font-size: 14px;
			font-weight: 300;
				font-family: "Lato";

			margin: 4px 0px;
			margin-left: 16px;

			&:hover {
				font-weight: 400;
			}
		}

		h4 {
			font-family: "Lato";
			font-size: 14px;
			font-weight: 600;

			margin-bottom: 6px;
			margin-top: 6px;
		}

		.selected-sidebar-post {
			/* make the selected post in the sidebar bolded */
			font-weight: 600 !important;
			font-style: italic;
		}
	}

</style>
