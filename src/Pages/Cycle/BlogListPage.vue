<template>
	<div>
		<div style="height: 96px"> </div>
		<div v-if="blog && blog.PostInfos.length > 0" class="blog-list-page-container">
			<div class="blog-post-block" v-for="post in blog.PostInfos" v-on:click="postClicked(post)">
				<div class="image-container">
					<image-component class="post-image" v-if="post.MainImage != null" :quality="'360p'" :auto-size="false" :image="post.MainImage"></image-component>
					<div class='image-color-overlay'> </div>
				</div>

				<h4 class="post-title"> {{ post.Title }} </h4>
				<h4 class="post-tour-info"> {{ post.Trip + ": " + post.DayRange.DisplayString }} </h4>
			</div>
		</div>
	</div>
</template>

<script>
import { BlogSource } from "../../scripts/Blog.js";
import ImageComponent from "../../Components/Image.vue";

export default {
	components: {
		"image-component": ImageComponent
	},

	data() {
		return {
			blog: null
		};
	},

	ready: function() {
		const data = this;
		BlogSource.FromFile("/assets/cycle/blog/posts.txt").then(blog => {
			data.blog = blog.CreateQuery(post => post.TripUrlString === "usa2016");
			data.blog.PostInfos.reverse();
		});
	},

	methods: {
		postClicked: function(post) {
			this.$root.ChangePage("blog-post-page", "/cycle/blog/" + post.Name, { PostName: post.Name });
		}
	}
};
</script>

<style lang="sass" id="style-sheet" scoped>

.post-title, .post-tour-info {
	font-family: "Raleway";
	margin: 0px;
	margin-top: 4px;
	text-align: left;
}

.post-tour-info {
	font-weight: 500;
	margin-top: 0px;
}

.introduction-text {
	width: 90%;
	margin: 16px auto;

	text-align: center;
}


.blog-post-block:hover > div > div {
	background-color: rgba(0, 0, 0, 0.1) !important;

	h1 {
		color: white !important;
	}

	h3 {
		color: white !important;
	}
}

.blog-post-block-background {
	width: 100%;
	height: 100% !important; background-position: center; background-size: cover;
}




.blog-list-page-container {
	margin: auto;
	margin-top: 8px;
	margin-bottom: 32px;
	width: 100%;
	max-width: 1600px;

	text-align: center;
}

@media all and (max-width: 952px) {
	.blog-post-block {
		width: 85% !important;
		margin: 16px 0 !important;
		text-align: center;
	}

}

@media all and (max-width: 1142px) and (min-width: 818px) {
	.tour-map {
		width: 800px !important;
	}
}


.blog-post-block {
	width: 400px;
	text-align: center;
	cursor: pointer;

	display: inline-block;
	margin: 16px 34px;
}

$block-width: 400px;
$block-height-aspect: 0.66;
.image-container {
	width: 100%;
	padding-bottom: 66%;
//	height: calc(#{$block-width} * #{$block-height-aspect});
}

.image-color-overlay {
	position: absolute;
	width: 100%;
	padding-bottom: 66%;
	top: 0;

	background-color: rgba(0, 0, 0, 0.3);
	transition: background-color 0.2s ease-in-out;
}

</style>
