<template>
	<div>
		<div v-if="blog && blog.PostInfos.length > 0" class="blog-list-page-container">
			<a :href="getPostLink(post)" class="blog-post-block" v-for="post in blog.PostInfos" v-on:click="postClicked($event, post)">
				<div class="image-container">
					<image-component class="post-image" v-if="post.MainImage != null" :quality="'360p'" :auto-size="false" :image="post.MainImage"></image-component>
					<div class='image-color-overlay'> </div>
				</div>

				<h4 class="post-title"> {{ post.Title }} </h4>
				<h4 class="post-tour-info"> {{ post.Trip + ": " + post.DayRange.DisplayString }} </h4>
			</a>
		</div>
	</div>
</template>

<script>
import { BlogSource } from "../../scripts/Blog.js";
import ImageComponent from "../../Components/Image.vue";
import { RESOURCES_URL } from "../../scripts/MiscHelper.js";

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
		BlogSource.FromFile(`${RESOURCES_URL}/cycle/blog/posts.txt`).then(blog => {
			data.blog = blog.CreateQuery(post => true);
			data.blog.PostInfos.reverse();
		});
	},

	methods: {
		postClicked: function(event, post) {
			if(event.which !== 1) return; // if middle or right click, then let the link do it's own work

			event.preventDefault();
			this.$root.ChangePage("blog-post-page", "/blog/" + post.URL, { PostName: post.Name });
		},

		getPostLink: function(post) {
			return "/blog/" + post.Name;
		}
	}
};
</script>

<style lang="sass" id="style-sheet" scoped>

.blog-list-page-container {
	margin: auto;
	margin-top: 8px;
	margin-bottom: 32px;
	width: 100%;
	max-width: 1600px;

	text-align: center;

	@media all and (max-width: 615px) {
		padding-top: 54px;
	}

	@media all and (min-width: 616px) {
		padding-top: 96px;
	}
}

.blog-post-block {
	width: 400px;
	text-align: center;
	cursor: pointer;

	display: inline-block;
	margin: 16px 34px;
	text-decoration: none;

	&:hover > div > div {
		background-color: rgba(0, 0, 0, 0.1) !important;
	}

	@media all and (max-width: 952px) {
		width: 85% !important;
		margin: 16px 0 !important;
		text-align: center;
	}
}

.blog-post-block-background {
	width: 100%;
	height: 100% !important; background-position: center; background-size: cover;
}

.post-title, .post-tour-info {
	font-family: "Raleway";
	margin: 0px;
	margin-top: 4px;
	text-align: left;
	color: black;

	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.post-tour-info {
	font-weight: 500;
	margin-top: 0px;
	text-decoration: none;
}

.image-container {
	width: 100%;
	padding-bottom: 66%;
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
