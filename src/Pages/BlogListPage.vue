<template>
	<div>
		<div style="height: 120px"> </div>
		<div v-if="blog.PostInfos.length > 0" class="blog-list-page-container">
			<div class="blog-post-block" v-for="post in blog.PostInfos">

				<div class="blog-post-block-background" style="background-image: url({{ post.Directory + '480p/' + post.MainImage  }});" v-on:click="postClicked(post)">
					<div class="post-block-container"> </div>
				</div>

				<h4 class="post-title"> {{ post.Title }} </h4>
				<h4 class="post-tour-info"> {{ post.Trip + ": Day " + post.DayRange }} </h4>
			</div>
		</div>
	</div>
</template>

<script>
import { BlogSource } from "../scripts/Blog.js";

export default {
	data() {
		return {
			blog: null
		};
	},

	ready: function() {
		const data = this;
		BlogSource.FromFile("/cycle/blog/posts.txt").then(blog => {
			data.blog = blog.CreateQuery(post => post.TripUrlString === "usa2016");
			data.blog.PostInfos.reverse();
		});
	},

	methods: {
		postClicked: function(post) {
			this.$root.ChangePage("blog-post-page", "/cycle/blog/" + post.Name, { PostInfo: post });
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
	width: 100%; background-position: center; background-size: cover;
}

.post-block-container {
	position: relative; width: 100%; padding-bottom: 66%; background-color: rgba(0, 0, 0, 0.3); transition: background-color 0.2s ease-in-out;
}


.blog-list-page-container {
	margin: auto;
	margin-top: 8px;
	margin-bottom: 32px;
	width: 100%;
	max-width: 1600px;

	text-align: center;
}

@media all and (max-width: 950px) {
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
	text-align: center;
	cursor: pointer;

	display: inline-block;
	margin: 16px 34px;

	width: 400px;
}
</style>
