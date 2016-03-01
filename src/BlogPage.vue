<template>
	<div id="post-container">
		<div id="main-image-container">
			<div class="main-image" style="background-image: url({{ blogPost.MainImage.FullPath }})"></div>

			<!-- Vignette -->
			<div style="position: absolute; top: 0px; height: 100%; width: 100%;
				background-color: rgba(0, 0, 0, 0.3); box-shadow: inset 0 0 25vw rgb(0, 0, 0);" ></div>

			<p class="main-image-title" style="">  {{ blogPost.Title.toUpperCase() }}</p>
			<div class="main-image-info-container">
				<h3>{{ blogPost.Trip }}</h3>
				<h3>Day {{ blogPost.DateRange }}</h3>
			</div>
		</div>

		<div class="navigation-controls" v-on="scroll:onScrolled">
			<a v-if="blog != null && blog.GetPreviousPostInfo(blogPost) != null" v-on:click="previousPostClicked" style="float:left; margin-left: 20px;"> {{ '< Day ' + blog.GetPreviousPostInfo(this.blogPost).DateRange }}</a>
			<a v-if="blog != null && blog.GetNextPostInfo(blogPost) != null" v-on:click="nextPostClicked" style="float:right; margin-right: 20px"> {{ 'Day ' + blog.GetNextPostInfo(blogPost).DateRange + ' >' }}</a>
		</div>

		<div id="content-container">
			<div class="content-block" v-for="block in blogPost.ContentBlocks" style="background-image: url({{ '../' + gallery.CurrentSource.Folder + 'thumbnails/' + photo.PhotoName}})" v-on:click="photoClicked(photo)">

				<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
				<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
				<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
				<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
					<!-- style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.35);"> -->
					<img src="{{ block.Image.FullPath }}" style="width: 100%;">
				</div>
			</div>
		</div>

		<cycle-map style="width: 70%; height: 60vh"></cycle-map>

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
			blogPost: null,
		};
	},

	components: {
		"image-group": ImageGroup,
		"cycle-map": CycleMap
	},

	ready: function() {
		let data = this;
		BlogList.FromFile("../blog/blog-posts.txt").then(async blog => {
			data.blog = blog;
			data.blogPost = await blog.GetBlogPostByIndex(0);
		});

		$(window).on('resize', () => {
			console.log($("#main-img").height());
			$("#main-image-container").height($("#main-img").height());
		});

		$(window).scroll(() => {
			const scrollAmount = $(window).scrollTop();
			console.log("xxx" + scrollAmount);
			if(scrollAmount > $(window).height() - 10) {
				$(".navigation-controls").addClass("fixed-to-top");
			}
			else {
				$(".navigation-controls").removeClass("fixed-to-top");
			}
		});
	},

	methods: {
		previousPostClicked: async function() {
			$('html, body').animate({
          		scrollTop: 0
        	}, 800, "swing", async () => {
				this.blogPost = await this.blog.GetBlogPostByPostInfo(this.blog.GetPreviousPostInfo(this.blogPost));
			});
		},

		nextPostClicked: function() {
			$('html, body').animate({
          		scrollTop: 0
        	}, 800, "swing", async () => {
				this.blogPost = await this.blog.GetBlogPostByPostInfo(this.blog.GetNextPostInfo(this.blogPost));
			});
		},

		onScrolled: function() {
			console.log("scroll!");
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

.image-group-block {
	width: 70%;
}

.navigation-controls {
	position: relative;
	width: 100%;
	a {
		font-size: 20px;
		font-weight: 700;
	}
}

.navigation-controls.fixed-to-top {
	position: fixed;
	top: 10px;
}

#post-container {
	color: rgb(200, 200, 200);
	font-size: 18px;
	text-align: center;

	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
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
			 color: rgb(225, 225, 225);
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

	.header-block {
		width: 90%;
		margin: auto;
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
