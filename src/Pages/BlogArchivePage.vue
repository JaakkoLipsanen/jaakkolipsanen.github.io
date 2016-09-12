<template>
	<div class="blog-list-page-container">
		<blog-post class="blog-post-block" v-for="(index, blogPostInfo) in blog.PostInfos" :post-info="blogPostInfo" :blog-source="blog" :load-style="getLoadStyleByIndex(index)">
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

	methods: {
		getLoadStyleByIndex: function(index) {
		/*	if(index == 0) { return 0; }
			else if(index < 3) { return 1; } */

			return 2;
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
	.blog-list-page-container {
		margin-top: 128px;
		margin-bottom: 64px;
	}


</style>
