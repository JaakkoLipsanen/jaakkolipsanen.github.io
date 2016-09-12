re<template>
	<div id="container" v-on:click="onLoadButtonClicked" style="cursor: pointer">
		<p class="blog-post-title"> {{ postInfo.Title }} </p>
		<p class="blog-post-trip"> {{ postInfo.Trip }}</p>
		<p class="blog-post-trip" style="color: rgb(80, 80, 80)"> {{ "Day " + postInfo.DayRange }}</p>
	<!--	<p v-el:load-button class="blog-post-load-button" v-on:click="onLoadButtonClicked">open</p> -->

		<div v-el:contentc class="content-container" >
			<div class="content-block" v-for="block in post.ContentBlocks">
				<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
				<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
				<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
				<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
					<!-- style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.35);"> -->

					<div style="width: 100%; padding-bottom: calcImgPaddingFromBlock(block); height: 0">
						<img photo="{{ block.Image }}" :srcset="block.Image.MultiPath" sizes="(max-width: 660px) 100vw, (max-width: 1100px) 660px, 60vw" style="width: 100%;" v-on:click="imageClicked(block.Image)">
					</div>
					<div v-if="block.Image.Text != '' "style="width: 100%; height: auto;">
						<p style="margin: 0; font-family: 'Lato'";>{{ block.Image.Text }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import { BlogSource, BlogPost, BlogQuery } from "../scripts/Blog.js";
import ImageGroup from "./ImageGroup.vue";

export const BlogLoadStyle = {
	Instant: 0,
	Automatic: 1,
	OnClick: 2,
};

export default {
	props: {
		postInfo: Object,
		blogSource: Object,
		loadStyle: Number,
	},

	data() {
		return {
			post: null,
			isOpen: false,
			isLoaded: false,
		};
	},

	components: {
		"image-group": ImageGroup
	},

	ready: async function() {
		if(this.loadStyle == BlogLoadStyle.Instant) {
			await this.load();
			this.open();
		}
	},

	methods: {
		onLoadButtonClicked: async function() {
			await this.load();
			this.open();
		},

		close: function() {
			this.isOpen = false;

			$(this.$els.contentc).css("max-height", 0);
		},

		open: function() {
			this.$dispatch('opening-post', this); // it's important that this is before the "this.isOpen = true" line, because calling this will call "close" on all blog post views, including the sender
			this.isOpen = true;

			console.log(this.$els);
			console.log(this.$els.contentc);
			console.log(this.$els["contentc"]);


			setTimeout(() => {
				$(this.$els.contentc).css("max-height", this.$els.contentc.scrollHeight);

			}, 50);
			console.log("opened: " +$(this.$els.contentc).css("max-height"));
			//$(this.$els.contentc).addClass("content-container-opened");

		},

		load: async function() {
			this.post = await this.blogSource.GetBlogPostByPostInfo(this.postInfo);
			this.isLoaded = true;
		}
	},

	events: {
		'close-blog': function() {
			this.close();
		}
	}
};
</script>

<style lang="sass" scoped>

	.content-container {
		max-height: 0px;
		transition: max-height 0.5s ease-in-out;

		overflow:  hidden;
	}

	.content-container-opened {
		max-height: 1000px;
	}

	.blog-post-title {
		font-family: Lato;
		margin: 0px;
		margin-left: 10%;
		font-size: 20px;
		color: rgb(160, 160, 160);
		font-weight: 600;

		display: inline-block;
	}

	.blog-post-trip {
		font-family: Lato;
		margin: 10px 0px;
		margin-left: 8px;
		font-size: 20px;
		color: rgb(120, 120, 120);
		font-weight: 600;

		right: 0;
		display: inline-block;
	}

	.blog-post-load-button {
		font-family: Lato;
		margin: 10px 8px;
		font-size: 20px;
		color: rgb(120, 120, 230);
		font-weight: 600;

		cursor: pointer;
		float: right;
		display: inline-block;
	}

	.blog-post-block {
		max-width: 1000px;
		width: 90%;
		border: 1px solid rgb(60, 60, 60);
		border-radius: 2px;
		margin: 8px auto;
		background-color: rgb(36, 36, 36);
	}

	h1 {
		color: white;
	}

	.content-block {
		margin: 32px auto;

		.image-block {
			width: 80%;
			cursor: pointer;

			&.fullwidth-img {
				width: 100% !important;
			}

			p {
				text-align: center;
			}
		}

		.text-block {
			width: 80%;
			max-width: 800px;
			margin: 16px auto;
			color: rgb(220, 220, 220);

			font-size: 18px;
			font-family: "Lato";
			text-align: left;
		}

		.header-block {
			width: 80%;
			max-width: 800px;
			margin: auto;
			font-size: 2.5em;
			text-align: left;
		}

		.image-group-block {
			width: 80%;
			margin: auto;
		}
	}

	@media all and (max-width: 602px) {
		.content-block {
	    	.image-block {
	    		width: 100% !important;
			}

			.image-group-block {
				width: 100% !important;
			}
		}

		.route-map {
			width: 100% !important;
		}

		.text-block {
			width: 95% !important;
		}

		.header-block {
			width: 95% !important;
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
		.header-block {
			width: 95% !important;
		}
	}

</style>
