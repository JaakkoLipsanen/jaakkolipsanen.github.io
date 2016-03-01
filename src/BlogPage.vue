<template>
	<div id="post-container">
		<div id="main-image-container" >
			<div class="main-image" style="background-image: url({{ blogPost.MainImageSource }});"></div>

			<!-- Vignette -->
			<div style="position: absolute; top: 0; height: 100%; width: 100%;
				background-color: rgba(0, 0, 0, 0.3); box-shadow: inset 0 0 25vw rgb(0, 0, 0);" ></div>

			<p class="main-image-title" style="">  {{ blogPost.Title.toUpperCase() }}</p>
			<div class="main-image-info-container">
				<h3 >{{ blogPost.Trip }}</h3>
				<h3>Day 1-4</h3>
			</div>
		</div>

		<div id="content-container">
			<div class="content-block" v-for="block in blogPost.ContentBlocks" style="background-image: url({{ '../' + gallery.CurrentSource.Folder + 'thumbnails/' + photo.PhotoName}})" v-on:click="photoClicked(photo)">

				<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
				<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
				<image-group v-if="block.Type == 'ImageGroup'" :group-images="block.Images"></image-group>
				<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
					<!-- style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.35);"> -->
					<img src="{{ block.Image.FullPath }}" style="width: 100%;">
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import Gallery from "./Gallery.vue";
import ImageGroup from "./ImageGroup.vue";
import { BlogList, BlogImage } from "./scripts/Blog.js";

export default {
	data() {
		return {
			blog: null,
			blogPost: null,
		};
	},

	components: {
		"gallery": Gallery,
		"image-group": ImageGroup,
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

.image-group {
	display: flex;
	width: 70%;
	margin: 0 auto;
}

.group-image img {
	width: 100%;
}

.group-image {
	flex: 1 1 100%;
	margin: 0px 3px;
}

.group-image.portrait {
	flex: 1 1 56.25%; /* so where does this come from? I'm not sure, but I think it's because 1 / 0.5625 == 1.7777 (same as 16:9 aspect ratio) and (4/3)^2 == 16/9 */
}


#post-container {
	color: rgb(211, 211, 211);
	font-size: 18px;
	text-align: center;
}

#main-image-container {
	 box-shadow: inset 0 0 10em #666;
	 position: relative;

	 /* main-image is 100% the height of the viewport/window */
	 .main-image {
		  width: 100%;
		  height: 100vh;
		  background-size: cover;
		  background-position: center;
	 }

	 .main-image-title {
		 position: absolute;
		 margin: 0;
		 left: 50%;
		 top: 50%;
		 transform: translate(-50%, -50%);
		 width: 95%;

		 font-weight: 800;
		 font-size: 8vw;
		 color: rgb(249, 249, 249);

		 @media all and (min-width: 1066px) and (max-width: 1920px) {
			 font-size: 64px;
		 }

		 @media all and (min-width: 1921px) {
			font-size: 96px;
		}
	 }

	 .main-image-info-container {
		 position: absolute;
		 left: 50%;
		 top: 90%;
		 font-family: "Open Sans";
		 transform: translate(-50%, -50%);
		 margin: 0;

		 h3 {
			 font-weight: 700;
			 font-size: 24px;
			 margin: -2px;
			 color: rgb(242, 242, 242);
		 }
	 }

}

.content-block {
	margin: 32px auto;

	.image-block {
		width: 70%;

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

@media all and (max-width: 422px) {
	.content-block {
    	.image-block {
    		width: 100% !important;
		}
	}

	.image-group {
		width: 100% !important;
	}

}

</style>
