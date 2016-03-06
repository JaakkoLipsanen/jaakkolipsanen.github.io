import Vue from "vue";
import Navbar from "./Navbar.vue";
import CodePage from "./CodePage.vue";
import CyclePage from "./CyclePage.vue";
import CycleTourPage from "./CycleTourPage.vue";
import BlogPostPage from "./BlogPostPage.vue";
import { mapify } from "es6-mapify";

// Vue.config.debug = true;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
var app = new Vue({
	el: "body",
	components: {
		"navbar": Navbar,
		"cycle-page": CyclePage,
		"code-page": CodePage,
		"cycle-page": CyclePage,
		"cycle-tour-page": CycleTourPage,
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
		this.ConstructPageFromUrl("/" + window.location.pathname);
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
				window.history.pushState(parameters, "", url);
			}
			else {
				window.history.replaceState(parameters, "", url);
			}

			if(this.currentView == pageName) {
				this.$broadcast("StateUpdated");
			}
			else {
				this.currentView = pageName;
			}
		},

		CurrentState() {
			return window.history.state;
		},

		ChangeURL: function(url, parameters) {
			parameters.url = url;
			window.history.pushState(parameters, "", url);
		},

		PopState: function() {
			this.ConstructPageFromUrl(this.CurrentState().url);
		},

		ConstructPageFromUrl: function(url) {
			const path = url.split("/").filter(Boolean);
			console.log(url);
			if(path[0] == "cycle") {
				if(path.length == 1) {
					this.ChangePage("cycle-page", url, { }, false);
				}
				else if(path.length == 2) {
					this.ChangePage("cycle-tour-page", url, { TourName: path[1] }, false );
				}
				else if(path.length == 3) {
					this.ChangePage("blog-post-page", url, { TourName: path[1], PostName: path[2] }, false );
				}
				else if(path.length == 4) {
					this.ChangePage("blog-post-page", url, { TourName: path[1], PostName: path[2], HighlightedImage: path[3] }, false );
				}
			}
			else if(path[0] == "404.html") {
				// this is default atm
				this.ChangePage("cycle-page", "/cycle", { }, true);
			}
		}
	}
});

window.addEventListener('popstate', function(event) {
	app.PopState();
});

// setTimeout(() => { app.currentView = "code-page" }, 3000);
