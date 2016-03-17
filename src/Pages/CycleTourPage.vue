<template>
	<div>
		<div style="height: 96px"></div>
		<cycle-map :route-path="CycleRoutePath" class="tour-map" style=" width: 70%; height: calc(100vh - 148px); min-height: 256px"></cycle-map>

		<div v-if="blog.PostInfos.length > 0" class="blog-list-page-container">
			<div class="blog-post-block" v-for="post in blog.PostInfos.reverse()">
				<div class="blog-post-block-background" style="background-image: url({{ post.Directory + '1080p/' + post.MainImage  }});" v-on:click="postClicked(post)">
					<div class="post-block-container">
						<h1 style="top: 50%; position: relative; transform: translateY(-50%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 3em; margin: 0">{{ post.Title }}</h1>
						<h3 style="top: 47%; position: relative; transform: translateY(-50%); color: rgb(190, 190, 190); font-family: 'Yanone Kaffeesatz'; font-size: 1.75em; margin: 0"> {{ 'Day ' + post.DateRange }} </h3>
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
			console.log(blog.PostInfos);
			data.blog = blog.CreateQuery(post => post.TripUrlString === data.CurrentTour.toLowerCase());
		});
	},

	computed: {
		CycleRoutePath: function() {
			return "/cycle/routes/" + this.CurrentTour + "/route.txt";
		},

		CurrentTour: function() {
			return this.$root.CurrentState().TourName;
		}
	},

	methods: {
		postClicked: function(post) {
			this.$root.ChangePage("blog-post-page", "/cycle/blog/" + post.Name, { TourName: this.CurrentTour, PostName: post.Name });
		}
	}
};
</script>

<style lang="sass" id="style-sheet" scoped>

.post-block-container {
	position: relative; width: 100%; height: 100%;  background-color: rgba(0, 0, 0, 0.4); transition: background-color 0.2s ease-in-out;

	h1, h3 {
		 transition: color 0.2s ease-in-out;
		 text-overflow: ellipsis;
		 overflow: hidden;
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
	flex: 1 1 50%; width: 450px; height: 450px; max-width: 100%; max-height: 100%; background-position: center; background-size: cover;
}

.blog-list-page-container {
	margin: auto;
	margin-top: 64px;
	margin-bottom: 32px;
	width: 90%;
	display: flex;

	flex-flow: row wrap;
	align-content: space-around;
	justify-content: center;
   -webkit-align-items: center;
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
}
</style>
