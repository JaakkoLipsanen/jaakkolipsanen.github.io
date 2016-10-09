<template>
	<div>
		<div style="height: 132px"></div>

		<div class="tour-info-container">
			<div class="tour-info previous-tour-info" v-if="HasPreviousTour" v-on:click="ChangeTour(-1)">
				<h1 class="prev"> Previous Tour </h1>
				<h1 class="tour-title"> {{ PreviousTour.name }} </h4>
				<h4 class="tour-year"> {{ PreviousTour.year }} </h4>
			</div>

			<div class="tour-info selected-tour-info">
				<h1 class="tour-title"> {{ CurrentTour.name }} </h4>
				<h4 class="tour-year"> {{ CurrentTour.year }} </h4>
			</div>

			<div class="tour-info next-tour-info" v-if="HasNextTour" v-on:click="ChangeTour(1)">
				<h1 class="prev"> Next Tour </h1>
				<h1 class="tour-title"> {{ NextTour.name }} </h4>
				<h4 class="tour-year"> {{ NextTour.year }} </h4>
			</div>

		</div>

		<cycle-map :route-path="CycleRoutePath" :theme="'light'" class="tour-map"></cycle-map>
		<div style="height: 0px"></div>
		<h2 style="margin-top: 0px; margin-bottom: 0px;"> {{ this.RouteLength + ' kilometers!' }} </h4>
		<h2 style="margin-top: 0px; margin-bottom: 64px;"> {{ this.RouteNightCount + ' days' }} </h4>

		<h2> Blog Posts </h2>
		<h4 v-if="currentTourPostInfos.length == 0" style="font-weight: 500">no blog posts from this tour...</h4>
		<div v-if="currentTourPostInfos.length > 0" class="blog-list-page-container">
			<div class="blog-post-block" v-for="post in currentTourPostInfos">
				<a href="{{ 'assets/cycle/blog/' + post.Name }}" class="blog-post-title"> {{ post.Title }} </a>
			</div>
		</div>

		<div style="height: 64px"></div>
 	</div>
</template>

<script>
import CycleMap from "../../Components/CycleMap.vue";
import { BlogSource } from "../../scripts/Blog.js";
import { CycleTourData } from "../../scripts/CycleTourData.js";

export default {
	data() {
		return {
			blog: null,
			currentTourPostInfos: [],
			currentTourIndex: CycleTourData.Tours.length - 1,

			currentMap: undefined
		};
	},

	components: {
		"cycle-map": CycleMap
	},

	ready: function() {
		const data = this;
		BlogSource.FromFile("/assets/cycle/blog/posts.txt").then(blog => {
			data.blog = blog;
			data.loadPosts();
		});
	},

	computed: {
		RouteLength: function() {
			return this.currentMap ? this.currentMap.RouteLength : "";
		},

		RouteNightCount: function() {
			return this.currentMap ? this.currentMap.NightCount : "";
		},

		CycleRoutePath: function() {
			return "/assets/cycle/routes/" + this.CurrentTour.shortName.replace(" ", "").toLowerCase() + "/route.txt";
		},

		CurrentTour: function() {
			return CycleTourData.Tours[this.currentTourIndex]; // GetTourByShortName("USA 2016");
		},

		HasNextTour: function() {
			return this.currentTourIndex < CycleTourData.Tours.length - 1;
		},

		HasPreviousTour: function() {
			return this.currentTourIndex > 0;
		},

		PreviousTour: function() {
			return CycleTourData.Tours[this.currentTourIndex - 1];
		},

		NextTour: function() {
			return CycleTourData.Tours[this.currentTourIndex + 1];
		}
	},

	methods: {
		postClicked: function(post) {
			this.$root.ChangePage("blog-post-page", "/assets/cycle/blog/" + post.Name, { TourName: this.CurrentTour, PostName: post.Name });
		},

		ChangeTour: function(direction) {
			this.currentTourIndex += direction;
			this.loadPosts();
		},

		loadPosts: function(direction) {
			this.currentTourPostInfos = this.blog.CreateQuery(post => post.Trip === this.CurrentTour.shortName).PostInfos;
			this.currentTourPostInfos.reverse(); // make the post infos go from newest to oldest
		}
	},

	events: {
		"map-loaded": function(map) {
			console.log(map);
			this.currentMap = map;
		}
	}
};
</script>

<style lang="sass" id="style-sheet" scoped>

div {
	text-align: center;
	font-family: "Raleway";
}

.prev {
	 font-size: 20px; margin-bottom: 0px; font-family: 'Raleway';
	 font-weight: 600;
}

.previous-tour-info, .next-tour-info {
	cursor: pointer;
	&:hover {
		transform: scale(1.04);
	}

	.tour-title, .tour-year {
		font-weight: 600 !important;
		opacity: 0.75;
		color: lighten(black, 10%);
	}

	.tour-title {
		font-size: 16px;
	}

	.tour-year {
		font-size: 14px;
	}
}

.selected-tour-info {
	.tour-title {
		font-size: 20px !important;
	}

	.tour-year {
		font-size: 16px !important;
	}
}

.tour-info {
	margin-bottom: 0;
	display: inline-block;

	.tour-title {
		margin-top: 4px;
		margin-bottom: 0px;
	}

	.tour-year {
		margin-top: 8px;
		margin-bottom: 8px;
	}
}

.tour-info-container {
	position: relative;
}

.previous-tour-info {
	float: left;
	left: 32px;

	position: absolute;
	bottom: 0;
}

.next-tour-info {
	float: right;
	right: 32px;

	position: absolute;
	bottom: 0;
}

.tour-map {
	width: 100% !important;
	height: calc(80vh - 148px) !important;

	color: black !important;
}

.blog-post-title {
	text-align: center;
	font-size: 18px;
	font-weight: 500;
	color: desaturate(#0000EE, 50%);
}

</style>

<style lang="sass">
.tour-map {
	.map-length-and-night-count-text {
	  display: none;
	}
}

</style>
