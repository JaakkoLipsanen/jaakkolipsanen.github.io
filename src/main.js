import Vue from "vue";
import Navbar from "./Navbar.vue";
import CyclePage from "./CyclePage.vue";
import CodePage from "./CodePage.vue";
import BlogPostPage from "./BlogPostPage.vue";
import BlogListPage from "./BlogListPage.vue";
import { mapify } from "es6-mapify";

// Vue.config.debug = true;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
const pagePath = window.location.pathname.split("/").filter(Boolean); // filter(Boolean) removes empty entries

const componentMap = new Map([["404.html", "blog-list-page"], ["blog", "blog-page"], ["cycle", "cycle-page"], ["altcode", "code-page"]]);
var app = new Vue({
	el: "body",
	components: {
		"navbar": Navbar,
		"cycle-page": CyclePage,
		"code-page": CodePage,
		"blog-post-page": BlogPostPage,
		"blog-list-page": BlogListPage,
	},

	data: {
		currentView: componentMap.has(pagePath[0]) ? componentMap.get(pagePath[0]) : "blog-list-page",
		pageParameters: new Map()
	},

	methods: {
		changePage: function(pageName, parameters) {
			$(window).scrollTop(0); // scroll to top

			if(parameters === undefined || parameters === null) {
				parameters = { };
			}
			this.pageParameters = mapify(parameters);
			console.log(this.pageParameters);
			this.currentView = pageName;
		}
	}
});

// setTimeout(() => { app.currentView = "code-page" }, 3000);
