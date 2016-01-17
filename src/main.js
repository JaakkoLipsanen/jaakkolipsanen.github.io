import Vue from "vue";
import Navbar from "./Navbar.vue";
import CyclePage from "./CyclePage.vue";
import CodePage from "./CodePage.vue";

// Vue.config.debug = true;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
var app = new Vue({
	el: "body",
	components: {
		"navbar": Navbar,
		"cycle-page": CyclePage,
		"code-page": CodePage
	},

	data: {
		currentView: "cycle-page"
	}
});

// setTimeout(() => { app.currentView = "code-page" }, 10000);