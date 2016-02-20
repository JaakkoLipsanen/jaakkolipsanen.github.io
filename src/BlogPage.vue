<template>
	<div id="post-container">
		<div id="main-image-container" >
			<div class="main-img" style="background-image: url({{ blogPost.Directory + blogPost.MainImageSource }}); width: 100%; height: 100vh; background-size: cover; background-position: center;">
			</div>
		<!--	<img id="main-img" src="{{ blogPost.Directory + blogPost.MainImageSource }}" style="filter: grayscale(0%);"></img> -->
			<div style="position: absolute; top: 0; height: 100%; width: 100%; background-color: rgba(0, 0, 0, 0.18);
				 box-shadow: inset 0 0 25vw 3.5vw rgb(0, 0, 0);" ></div>

	 		<p style="position: absolute; font-size: 64px; color: rgb(249, 249, 249); font-weight: 800; left: 50%; top: 50%; transform: translate(-50%, -50%); margin: 0;">{{ blogPost.Title.toUpperCase() }}</p>
		</div>

		<div id="content-container">
			<div class="content-block" v-for="block in blogPost.ContentBlocks" style="background-image: url({{ '../' + gallery.CurrentSource.Folder + 'thumbnails/' + photo.PhotoName}})" v-on:click="photoClicked(photo)">

				<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
				<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
				<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" v-else
					style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 40em rgba(0, 0, 0, 0.35);">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Gallery from "./Gallery.vue";
import { BlogList } from "./scripts/Blog.js";

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


#post-container {
	color: rgb(211, 211, 211);
	font-size: 18px;
	text-align: center;



	#main-img {
		width: 100%;
	}
}

#main-image-container {
	 box-shadow: inset 0 0 10em #666;
	 position: relative;
}

.content-block {
	margin: 32px auto;

	.image-block {
		width: 80%;

		&.fullwidth-img {
			width: 100% !important;
		}
	}

	.text-block {
		width: 90%;
		max-width: 800px;
		margin: 16px auto;
		color: rgb(180, 180, 180);
	}
}

</style>
