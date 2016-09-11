<template>
	<div class="blog-list-page-container">
		<blog-post class="blog-post-block" v-for="blogPostInfo in blog.PostInfos" :post-info="blogPostInfo" :blog-source="blog" >
		<!--	<p class="blog-post-title"> {{ post.Title }}</p>
			<p class="blog-post-trip"> {{ post.Trip }}</p> -->
		</div>
	</div>
</template>

<script>;
import { BlogSource, BlogPost, BlogQuery } from "../scripts/Blog.js";
import BlogPostView from "../Components/BlogPostView.vue";
import Vue from "vue";

export default {
	data() {
		return {
			blog: null,
		};
	},

	components: {
		"blog-post": BlogPostView
	},

	ready: function() {
		let data = this;
		BlogSource.FromFile("/cycle/blog/posts.txt").then(async blog => {
			data.blog = blog.CreateQuery();
			data.blog.PostInfos.reverse(); // make the post infos go from newest to oldest
		});
	},

};
</script>

<style lang="sass" id="style-sheet" disabled=false>
	.blog-list-page-container {
		margin-top: 128px;
	}

	body {
		background-color: rgb(248, 248, 248) !important;
	}
</style>
