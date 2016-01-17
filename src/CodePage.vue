<template>
	<a  v-on:click="changePage">cycle</a>
	<div id="about-me-container">
		<h1 style="text-align: center; padding: 0px; margin-bottom: 0px;">Welcome</h1>
		<hr />

		<p>My name is Jaakko Lipsanen. I am an 20-year-old game developer from Helsinki, Finland. Most of my completed projects can be found on this site.</p>
		<p>I have programmed and developed games for three years. During that time, I have released several games for Windows Phone with over 1,000,000 downloads.</p>
		<p>I consider myself to be proficient in C# and Java and intermediate in C++. I also know the basics of JavaScript, Clojure, Python as well as HTML and CSS (this page proves that!).</p>
		<p>I have developed my games mainly using C# and <a href="http://en.wikipedia.org/wiki/Microsoft_XNA">XNA</a>, but recently I have switched to using <a href="https://unity3d.com/">Unity</a>. I have also made some projects using C++ and OpenGL/SFML.</p>
		<p>I graduated from high school in the spring of 2014 and I am planning to begin studying Computer Science at the University of Helsinki in the fall of 2016.</p>

		<!-- some space after the text before footer -->
		<div style="margin: 36px;"></div>
	</div>

</template>

<script>
export default {
	data() {
		return {
		};
	},

	ready: function() {
		$("body").addClass("white-bg");
		$("#navbar-header-text").addClass("black-navbar-header-text");
		$("#about-me-container").addClass("show");

		console.log("ÄÄÄ");
	},

	methods: {
		changePage: function() {
			this.$parent.currentView = "cycle-page";
		}
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>
	.white-bg {
		background-color: rgb(255, 255, 255);
	}

	.black-navbar-header-text {
		transition: color 0.7s ease-in-out;
		color: rgb(64, 64, 64) !important;
	}

	.show {
	transition: opacity 15s ease-in-out;
		opacity: 1 !important;
	}

	#about-me-container {
		text-align: center;
		width: 90%;
		max-width: 600px;
		display: block;
		margin: auto;
		overflow: auto;
		opacity: 0;
		transition: opacity 5s ease-in-out;

		h1 {
			font: normal 2.5em "Yanone Kaffeesatz", sans-serif;
		}

		h2 {
			font: normal 2em "Yanone Kaffeesatz", sans-serif;
		}
	}
</style>
