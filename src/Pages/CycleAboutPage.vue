<template>
	<div>
		<div style="height: 64px"></div>
		<p class="introduction-text">Hey! I'm currently cycling in the Western USA for about four months! Below is the map where I've been cycling and blog posts!</p>
		<p class="introduction-text">You can find my previous trips by going to the 'trips' section!</p>
		<cycle-map :route-path="CycleRoutePath" theme="light" class="tour-map"></cycle-map>

		<p style="text-align: center; font-size: 22px; margin: auto; margin-top: 64px; height: 16px; margin-bottom: -14px">blog</p>
		<div v-if="blog.PostInfos.length > 0" class="blog-list-page-container">
			<div class="blog-post-block" v-for="post in blog.PostInfos">
				<div class="blog-post-block-background" style="background-image: url({{ post.Directory + '1080p/' + post.MainImage  }});" v-on:click="postClicked(post)">
					<div class="post-block-container">
						<h1 style="top: 50%; position: relative; transform: translateY(-50%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 3em; margin: 0">{{ post.Title }}</h1>
						<h3 style="top: 47%; position: relative; transform: translateY(-50%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 1.75em; margin: 0"> {{ 'Day ' + post.DayRange }} </h3>
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
			data.blog = blog.CreateQuery(post => post.TripUrlString === "usa2016");
			data.blog.PostInfos.reverse();
		});
	},

	computed: {
		CycleRoutePath: function() {
			return "/cycle/routes/europe2014/route.txt";
		},
	},

	methods: {
		postClicked: function(post) {
			this.$root.ChangePage("blog-post-page", "/cycle/blog/" + post.Name, { TourName: "usa2016", PostName: post.Name });
		}
	}
};
</script>

<style lang="sass" id="style-sheet" scoped>

.tour-map {
	width: 70% !important;
	height: calc(100vh - 208px) !important;
	min-height: 256px;

}
.introduction-text {
	width: 90%;
	margin: 16px auto;

	text-align: center;
}

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

@media all and (max-width: 1142px) and (min-width: 818px) {
	.tour-map {
		width: 800px !important;
	}
}

@media all and (max-width: 817px) {
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
