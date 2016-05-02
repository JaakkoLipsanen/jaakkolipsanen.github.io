<template>
	<div>

		<div style="margin-top: 164px"> </div>
		<div class="blog-list-page-container">
			<div class="blog-post-block" v-for="post in blog.PostInfos">
				<div class="blog-post-block-background" style="background-image: url({{ post.Directory + '720p/' + post.MainImage  }});" v-on:click="postClicked(post)">
					<div class="post-block-container">
						<h1 style="top: 50%; position: relative; transform: translateY(-50%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 3em; margin: 0">{{ post.Title }}</h1>
						<h3 style="top: 80%; position: relative; transform: translateY(-50%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 1.75em; margin: 0"> {{ 'Day ' + post.DayRange }} </h3>
						<h3 style="top: 100%; left: 50%;  position: absolute; transform: translate(-50%, -120%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 1.75em; margin: 0"> {{ post.Trip }} </h3>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import CycleMap from "../Components/CycleMap.vue";
import { BlogSource } from "../scripts/Blog.js";

export default {
	data() {
		return {
			blog: null
		};
	},

	components: {
		"cycle-map": CycleMap
	},

	ready: function() {
		const data = this;
		BlogSource.FromFile("/cycle/blog/posts.txt").then(blog => {
			data.blog = blog.CreateQuery();
			data.blog.PostInfos.reverse();
		});
	},

	methods: {
		postClicked: function(post) {
			this.$root.ChangePage("blog-post-page", "/cycle/blog/" + post.Name, { TourName: this.$root.CurrentState().TourName, PostName: post.Name });
		}
	}
};
</script>

<style lang="sass" id="style-sheet" scoped>

.post-block-container {
	position: relative; width: 100%; height: 100%;  background-color: rgba(0, 0, 0, 0.4); transition: background-color 0.2s ease-in-out;

	h1, h3 {
		 transition: color 0.2s ease-in-out;
	}
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
	width: 100%; height: 100%; max-width: 100%; max-height: 100%; background-position: center; background-size: cover;
}

.blog-list-page-container {
	margin: auto;
	margin-top: 8px;
	margin-bottom: 32px;
	width: 100%;
}

@media all and (max-width: 526.5px) {
	.blog-list-page-container {
		width: 100% !important;
	}

	.blog-post-block {
		width: 100% !important;
	}

	.tour-map {
		width: 100% !important;
	}
}

.blog-post-block {
	text-align: center;
	cursor: pointer;
	margin: 64px auto;
	width: 800px; height: 600px;
	max-width: 100%;
	max-height: 90vh;

	transition: height 999999s;
}
</style>
