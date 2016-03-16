import Vue from "vue";
import Navbar from "./Components/Navbar.vue";

import CodePage from "./Pages/CodePage.vue";
import CodeProjectsPage from "./Pages/CodeProjectsPage.vue";
import CodeCvPage from "./Pages/CodeCvPage.vue";

import CycleAboutPage from "./Pages/CycleAboutPage.vue";
import CycleTripsPage from "./Pages/CycleTripsPage.vue";
import CycleBlogPage from "./Pages/CycleBlogPage.vue"
import CycleTourPage from "./Pages/CycleTourPage.vue";
import BlogPostPage from "./Pages/BlogPostPage.vue";

import { mapify } from "es6-mapify";

const ConstantURL = (window.location.pathname == "/404.html") ? "/404.html" : undefined; // if accessing 404.html then don't modify url
// Vue.config.debug = true;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
var app = new Vue({
	el: "body",
	components: {
		"navbar": Navbar,

		"code-page": CodePage,
		"code-projects-page": CodeProjectsPage,
		"code-cv-page": CodeCvPage,

		"cycle-about-page": CycleAboutPage,
		"cycle-trips-page": CycleTripsPage,
		"cycle-tour-page": CycleTourPage,
		"cycle-blog-page": CycleBlogPage,
		"blog-post-page": BlogPostPage,
	},

	data: {
		currentView: "",
	},

	computed: {
		CurrentUrl: function() {
			return  window.location.pathname;
		},
	},

	ready: function() {
		this.ConstructPageFromUrl(window.location.pathname);
	},

	methods: {
		ChangePage: function(pageName, url, parameters, saveToHistory = true) {
			$(window).scrollTop(0); // scroll to top

			if(parameters === undefined || parameters === null) {
				parameters = { };
			}

			parameters.url = url;
		//	this.pageParameters = mapify(parameters);
			if(saveToHistory) {
				window.history.pushState(parameters, "", ConstantURL || url);
			}
			else {
				window.history.replaceState(parameters, "", ConstantURL || url);
			}

			if(this.currentView == pageName) {
				this.$broadcast("StateUpdated");
			}
			else {
				this.currentView = pageName;
				this.$broadcast("PageChanged", pageName);
			}
		},

		CurrentState() {
			return window.history.state;
		},

		ChangeURL: function(url, parameters) {
			parameters.url = url;
			window.history.pushState(parameters, "", ConstantURL || url);
		},

		PopState: function() {
			this.ConstructPageFromUrl(this.CurrentState().url);
		},

		ConstructPageFromUrl: function(url) {
			const path = url.split("/").filter(Boolean);

			if(path[0] == "cycle") {
				if(path.length == 1) {
					this.ChangePage("cycle-about-page", url, { }, false);
				}
				else if(path[1] == "trips") {
					if(path.length == 2) {
						this.ChangePage("cycle-trips-page", url, { }, false );
					}
					else if(path.length == 3) {
						this.ChangePage("cycle-tour-page", url, { TourName: path[2] }, false );
					}
				}
				else if(path[1] == "blog") {
					if(path.length == 2) {
						this.ChangePage("cycle-blog-page", url, { }, false);
					}
					else if(path.length == 3) {
						this.ChangePage("blog-post-page", url, { TourName: undefined, PostName: path[2] }, false );
					}
				}
			}
			else if(path[0] == "404.html") {
				// this is default atm
				this.ChangePage("cycle-about-page", "/cycle", { }, true);
			}
			else if(path[0] == "code") {
				if(path.length == 1) {
					this.ChangePage("code-page", url, { }, false);
				}
				else if(path[1] == "cv") {
					this.ChangePage("code-cv-page", url, { }, false);
				}
				else if(path[1] == "projects") {
					this.ChangePage("code-projects-page", url, { }, false);
				}
			}
		}
	}
});

window.addEventListener('popstate', function(event) {
	app.PopState();
});

// setTimeout(() => { app.currentView = "code-page" }, 3000);
