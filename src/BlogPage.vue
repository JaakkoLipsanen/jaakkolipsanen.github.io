<template>
	<div id="post-container">
		<div v-for="block in blogPost.ContentBlocks" style="background-image: url({{ '../' + gallery.CurrentSource.Folder + 'thumbnails/' + photo.PhotoName}})" v-on:click="photoClicked(photo)">
			<p v-if="block.Text != undefined">{{ block.Text }}</p>
			<img v-else src="{{ blogPost.Directory + block.Source }}"> </img>
		</div>
	</div>
</template>

<script>
import Gallery from "./Gallery.vue";
import { BlogList, BlockType, TextBlock, ImageBlock } from "./scripts/Blog.js";

export default {
	data() {
		return {
			blog: null,
			blogPost: null,
		};
	},

	components: {
		"gallery": Gallery
	},

	ready: function() {
		let data = this;
		BlogList.FromFile("../blog/blog-posts.txt").then(async blog => {
			console.log(blog.Posts[0]);

			const post = await blog.GetBlogPostByName(blog.Posts[0]);
			data.blogPost = post;
			console.log(post.ContentBlocks[0]);
		});
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

#post-container {
	color: rgb(211, 211, 211);

	font-size: 18px;

	text-align: center;

	p {
		width: 800px;
		margin: 16px auto;
	}

}
</style>
