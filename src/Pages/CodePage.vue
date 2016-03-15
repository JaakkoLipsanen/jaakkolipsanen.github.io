<template>
	<div id="about-me-container">

		<p>My name is Jaakko Lipsanen. I am an 20-year-old game developer from Helsinki, Finland. Most of my completed projects can be found on this site.</p>
		<p>I have programmed and developed games for three years. During that time, I have released several games for Windows Phone with over 1,000,000 downloads.</p>
		<p>I consider myself to be proficient in C# and Java and intermediate in C++. I also know the basics of JavaScript, Clojure, Python as well as HTML and CSS (this page proves that!).</p>
		<p>I have developed my games mainly using C# and <a href="http://en.wikipedia.org/wiki/Microsoft_XNA">XNA</a>, but recently I have switched to using <a href="https://unity3d.com/">Unity</a>. I have also made some projects using C++ and OpenGL/SFML.</p>
		<p>I graduated from high school in the spring of 2014 and I am planning to begin studying Computer Science at the University of Helsinki in the fall of 2016.</p>

	</div>

	<footer-bar></footer-bar>
</template>

<script>
import Footer from "../Components/Footer.vue";

export default {
	data() {
		return {
		};
	},

	components: {
		"footer-bar": Footer
	},

	ready: function() {
		$("body").addClass("white-bg");
		$("#navbar-header-text").addClass("black-navbar-header-text");
		$("#about-me-container").addClass("show");
	}
};
</script>

<style lang="sass" id="style-sheet" disabled=false>

	.show {
	transition: opacity 15s ease-in-out;
		opacity: 1 !important;
	}

	#about-me-container {
		text-align: center;
		width: 90%;
		max-width: 600px;
		display: block;
		margin: 96px auto 0 auto;
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

	hr {
		border-color: inherit !important;
		width: 500px;
	}

	p {
		color: rgb(180, 180, 180);
	}

</style>
