<template>
	<div class="blog-list-page-container">
		<div class="blog-post-block" v-for="post in blog.PostInfos"  v-on:click="photoClicked(photo)">
			<a v-on:click="postClicked(post)">{{ 'Day ' + post.DateRange + ': ' + post.Title }} </a>

		</div>
	</div>
</template>

<script>
import ImageGroup from "./ImageGroup.vue";
import CycleMap from "./CycleMap.vue";
import { BlogList, BlogPost, BlogImage } from "./scripts/Blog.js";

export default {
	data() {
		return {
			blog: null,
		};
	},

	components: {
	},

	ready: function() {
		let data = this;
		BlogList.FromFile("../blog/blog-posts.txt").then(async blog => {
			data.blog = blog;
		});
	},

	methods: {
		postClicked: function(post) {
			console.log(post.Title);
			this.$dispatch("change-page", "blog-post-page");
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>
.blog-list-page-container {
	margin-top: 256px;
}

.blog-post-block {
	text-align: center;
}
</style>
