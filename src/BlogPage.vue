<template>
	<div id="post-container">
		<div id="main-image-container">
			<img id="main-img" src="{{ blogPost.Directory + blogPost.MainImageSource }}"></img>
			<div style="position: absolute; top: 0; height: 100%; width: 100%; background-color: rgba(0, 0, 0, 0.2); opacity: 1;
				 box-shadow: inset 0 0 40em rgb(0, 0, 0);" ></div>
	 			<p style="position: absolute; top: 55%; text-align: center; font-size: 64px; color: rgb(233, 233, 233); font-weight: 800; width: 100%;">{{ blogPost.Title.toUpperCase() }}</p>
		</div>

		<div id="content-container">
			<div v-for="block in blogPost.ContentBlocks" style="background-image: url({{ '../' + gallery.CurrentSource.Folder + 'thumbnails/' + photo.PhotoName}})" v-on:click="photoClicked(photo)">
				<p v-if="block.Text != undefined">{{ block.Text }}</p>
				<img v-else src="{{ blogPost.Directory + block.Source }}"> </img>
			</div>
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

		$(window).on('resize', () => {
			console.log($("#main-img").height());
			$("#main-image-container").height($("#main-img").height());
		});
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

#main-image-container {
	 box-shadow: inset 0 0 10em #666;
	 position: relative;
}
#post-container {
	color: rgb(211, 211, 211);

	font-size: 18px;

	text-align: center;

	p {
		width: 800px;
		margin: 16px auto;
	}

	#main-img {
		width: 100%;
	}
}

#content-container {
	img {
		max-width: 80%;
		max-height: 90vh;
	}
}
</style>
