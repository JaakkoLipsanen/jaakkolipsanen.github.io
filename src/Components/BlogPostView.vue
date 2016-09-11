<template>
	<div id="container">
		<p class="blog-post-title"> {{ postInfo.Title }} </p>
		<p class="blog-post-trip"> {{ postInfo.Trip }}</p>

		<div id="content-container">
			<div class="content-block" v-for="block in post.ContentBlocks">
				<p v-if="block.Type == 'Text'" class="text-block">{{ block.Text }}</p>
				<h1 v-if="block.Type == 'Header'" class="header-block"> {{ block.Title }} </h1>
				<image-group v-if="block.Type == 'ImageGroup'" class="image-group-block" :group-images="block.Images"></image-group>
				<div v-if="block.Type == 'Image'" class="image-block" v-bind:class="{ 'fullwidth-img': block.IsFullWidth }" style="margin: auto" v-else>
					<!-- style="background-image: url({{ blogPost.Directory + block.Source }}); height: 900px; background-size: cover; background-repeat: no-repeat; background-position: center; margin: 8px auto; box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.35);"> -->
					<img photo="{{ block.Image }}" :srcset="block.Image.MultiPath" sizes="(max-width: 660px) 100vw, (max-width: 1100px) 660px, 60vw" style="width: 100%;" v-on:click="imageClicked(block.Image)">
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

export default {
	props: {
		postInfo: Object,
		blogSource: Object,
	},

	data() {
		return {
			post: null,
		};
	},

	components: {
		"image-group": ImageGroup
	},

	ready: async function() {
		console.log(this.postInfo.Title);
		this.post = await this.blogSource.GetBlogPostByPostInfo(this.postInfo);
	},

	methods: {

	},

	events: {

	}
};
</script>

<style lang="sass" scoped>

		.blog-post-title {
			font-family: Lato;
			margin: 0px;
			margin-left: 8px;
			font-size: 20px;
			color: rgb(64, 64, 64);
			font-weight: 600;

			display: inline-block;

		}

		.blog-post-trip {
			font-family: Lato;
			margin: 10px 0px;
			margin-left: 8px;
			font-size: 20px;
			color: rgb(160, 160, 160);
			font-weight: 600;

			right: 0;
			display: inline-block;
		}

		.blog-post-block {
			max-width: 1000px;
			width: 90%;
			border: 1px solid rgb(200, 200, 200);
			border-radius: 2px;
			margin: 8px auto;
			background-color: white;
		}

		h1 {
			color: black;
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
					color: rgb(120, 120, 120);

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
