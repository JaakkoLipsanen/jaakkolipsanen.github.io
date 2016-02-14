import Vue from "vue";
import Navbar from "./Navbar.vue";
import CyclePage from "./CyclePage.vue";
import CodePage from "./CodePage.vue";
import BlogPage from "./BlogPage.vue";

// Vue.config.debug = true;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
const pagePath = window.location.pathname.split("/").filter(Boolean); // filter(Boolean) removes empty entries

const componentMap = new Map([["404.html", "blog-page"], ["blog", "blog-page"], ["cycle4", "cycle-page"], ["code32", "code-page"]]);
console.log(componentMap.has(pagePath[0]) ? componentMap.get(pagePath[0]) : "cycle-page");
var app = new Vue({
	el: "body",
	components: {
		"navbar": Navbar,
		"cycle-page": CyclePage,
		"code-page": CodePage,
		"blog-page": BlogPage
	},

	data: {
		currentView: componentMap.has(pagePath[0]) ? componentMap.get(pagePath[0]) : "blog-page"
	}
});



// setTimeout(() => { app.currentView = "code-page" }, 3000);
