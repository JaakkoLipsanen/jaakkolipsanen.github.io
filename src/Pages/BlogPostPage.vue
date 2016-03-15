<template>
	<div id="post-container">
		<div id="main-image-container">
			<div class="main-image" style="background-image: url({{ blogPost.MainImage.FullPath('1080p') }})"></div>

			<!-- Vignette -->
			<div style="position: absolute; top: 0px; height: 100%; width: 100%;
				background-color: rgba(0, 0, 0, 0.3); box-shadow: inset 0 0 25vw rgb(0, 0, 0);" ></div>

			<p class="main-image-title">  {{ blogPost.Title.toUpperCase() }}</p>
			<div class="main-image-info-container">
				<h3>Day {{ blogPost.DateRange }}</h3>
			</div>
		</div>

		<div class="nav-cont" style="position: fixed; height: 48px; top: calc(100% - 48px);">
			<h1 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: Yanone Kaffeesatz; margin: auto; font-size: 1.5em" v-on:click="blogListClicked">{{ blogPost.Trip }}</h1>
			<p v-if="blog != null && blog.GetPreviousPostInfo(blogPost) != null" v-on:click="previousPostClicked" style="font-size: 22px; margin: auto; position: absolute; top: 12px; left: 32px;  font-weight: 700;  display: block"> {{ '&lt; ' + blog.GetPreviousPostInfo(blogPost).DisplayString }}</p>
			<p v-if="blog != null && blog.GetNextPostInfo(blogPost) != null" v-on:click="nextPostClicked" style="font-size: 22px; margin: auto; position: absolute; top: 12px; right: 32px; font-weight: 700; display: block"> {{  blog.GetNextPostInfo(blogPost).DisplayString + ' &gt;' }}</p>
		</div>

		<div id="content-container">
			<div class="content-block" v-for="block in blogPost.ContentBlocks">

				<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
				<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
				<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
				<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
					<!-- style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.35);"> -->
					<img v-bind:class="block.Image.FileName.replace('.jpg', '')" photo="{{ block.Image }}" src="{{ block.Image.FullPath('1080p') }}" style="width: 100%;" v-on:click="imageClicked(block.Image)">
				</div>
			</div>
		</div>

		<cycle-map class="route-map" theme="light"></cycle-map>
		<image-viewer style="display: none"></image-viewer>

	</div>
</template>

<script>
import ImageGroup from "../Components/ImageGroup.vue";
import CycleMap from "../Components/CycleMap.vue";
import ImageViewer from "../Components/ImageViewer.vue";
import { BlogSource, BlogPost, BlogQuery } from "../scripts/Blog.js";
import Vue from "vue";

export default {
	data() {
		return {
			blog: null,
			blogPost: null,
		};
	},

	components: {
		"image-group": ImageGroup,
		"cycle-map": CycleMap,
		"image-viewer": ImageViewer
	},

	ready: function() {
		let data = this;
		BlogSource.FromFile("/cycle/blog/posts.txt").then(async blog => {
			const tour = data.$root.CurrentState().TourName;
			data.blog = blog.CreateQuery((post) => (tour === undefined) || post.TripUrlString === tour.toLowerCase());
			data.blogPost = await data.blog.GetBlogPostByName(data.$root.CurrentState().PostName);
		});

		$(window).on('resize', () => {
			$("#main-image-container").height($("#main-img").height());
		});

		$(window).scroll(() => {;
			const scrollAmount = $(window).scrollTop();
			if(scrollAmount < 48) {
				$(".nav-cont").removeClass("has-scrolled");
			}
			else {
				$(".nav-cont").addClass("has-scrolled");
			}
		});
	},

	methods: {
		previousPostClicked: function() {
			$('body').animate({
          		scrollTop: 0
        	}, Math.min($(window).scrollTop(), 800), "swing", async () => {
				this.blogPost = await this.blog.GetBlogPostByPostInfo(this.blog.GetPreviousPostInfo(this.blogPost));
				this.$root.ChangeURL("/cycle/blog/" + this.blogPost.Name, { TourName: this.$root.CurrentState().TourName, PostName: this.blogPost.Name });
			});
		},

		nextPostClicked: function() {
			$('body').animate({
          		scrollTop: 0
        	}, Math.min($(window).scrollTop(), 800), "swing", async () => {
				this.blogPost = await this.blog.GetBlogPostByPostInfo(this.blog.GetNextPostInfo(this.blogPost));
				this.$root.ChangeURL("/cycle/blog/" + this.blogPost.Name, { TourName: this.$root.CurrentState().TourName, PostName: this.blogPost.Name });
			});
		},

		blogListClicked: function() {
			this.$root.ChangePage("cycle-tour-page", "/cycle/trips/" + this.blogPost.TripUrlString, { TourName:this.blogPost.TripUrlString });
		},

		imageClicked: function(photo) {
			this.$broadcast("show-photo", photo);
		}
	},

	events: {
		"StateUpdated": function() {
			let data = this;
			BlogSource.FromFile("/cycle/blog/posts.txt").then(async blog => {
				const tour = data.$root.CurrentState().TourName;
				data.blog = blog.CreateQuery((post) => (tour === undefined) || post.Trip.replace(" ", "").toLowerCase() === tour.toLowerCase());
				data.blogPost = await data.blog.GetBlogPostByName(data.$root.CurrentState().PostName);
			});
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

.nav-cont {
	width: 100%;
	z-index: 1;

	p, h1 {
		color: rgb(205, 205, 205);
		cursor: pointer;
		transition: color 0.2s ease-in-out, opacity 0.2s ease-in-out;

		&:hover {
			color: white !important;
			opacity: 1;
		}
	}

	p {
		opacity: 0.65;
	}

	h1 {
		visibility: visible;
	}
}

.nav-cont.has-scrolled {
	background-color: rgba(0, 0, 0, 0.3);

	h1 {
		visibility: visible;
	}

	p {
		opacity: 1;
		color: rgb(205, 205, 205);
	}
}

.route-map {
	width: 60% !important;
	height: 75vh !important;
	margin-bottom: 72px !important;
}

#post-container {
	color: rgb(200, 200, 200);
	font-size: 18px;
	text-align: center;
	font-family: "Yanone Kaffeesatz";

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

		 @media all and (min-width: 1920px) {
			font-size: 80px;
		}
	 }

	 .main-image-info-container {
		 position: absolute;
		 left: 50%;
		 top: calc(100% - 54px);
		 transform: translate(-50%, -50%);
		 margin: 0;

		 h3 {
			 font-weight: 700;
			 font-size: 24px;
			 margin: -2px;
			 color: rgb(205, 205, 205);
		 }
	 }
}

.content-block {
	margin: 32px auto;

	.image-block {
		width: 60%;
		cursor: pointer;

		&.fullwidth-img {
			width: 100% !important;
		}
	}

	.text-block {
		width: 60%;
		max-width: 800px;
		margin: 16px auto;
		color: rgb(180, 180, 180);

		font-size: 22px;
		font-family: "Lato";
	}

	.header-block {
		width: 60%;
		margin: auto;
		font-size: 2.5em;
	}

	.image-group-block {
		width: 60%;
		margin: auto;
	}
}

@media all and (max-width: 602px) {
	.content-block {
    	.image-block {
    		width: 100% !important;
			max-width: 422px!important;
		}

		.image-group-block {
			width: 100% !important;
			max-width: 422px!important;
		}
	}

	.route-map {
		width: 100% !important;
		max-width: 422px!important;
	}

	.text-block {
		width: 95% !important;
		max-width: 422px!important;
	}
}

@media all and (max-width: 1100px) {
	.navigation-controls.fixed-to-top {
		background-color: rgba(0, 0, 0, 0.75);
	}

	.content-block {
    	.image-block {
    		width: 100% !important;
			max-width: 660px!important;
		}

		.image-group-block {
			width: 100% !important;
			max-width: 660px!important;
		}
	}

	.route-map {
		width: 100% !important;
		max-width: 660px!important;
	}

	.text-block {
		width: 95% !important;
		max-width: 660px!important;
	}
}

</style>
