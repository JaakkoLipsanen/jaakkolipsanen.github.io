<template>
	<div id="footer-container">
		<hr />
		<p class="footer-text"><a href="mailto:jaakko.lipsanen@outlook.com">jaakko.lipsanen@outlook.com</a></p>
		<p class="footer-text">&copy; Jaakko Lipsanen. All Rights Reserved</p>
		<p class="footer-text" id="hosted-on-github-text">Hosted on <a href="https://pages.github.com/">GitHub Pages</a> </p>
	</div>
</template>

<script>
export default {
	data() {
		return {
		};
	}
};
</script>

<style lang="sass" scoped>
	// move font-stack to general.scss?
	$footer-text-color: rgb(100, 100, 100);
	$footer-link-color: desaturate(rgb(96, 96, 180), 5);
	.footer-text {
	    font-size: 14px;
	    color: $footer-text-color;
	    text-align: center;
	    margin: 4px 0px 0px;

	    a {
		    font-size: 14px;
	        color: $footer-link-color;
	    }
	}

	/* The horizontal line which divides groups */
	hr {
		width: 400px;
		max-width: 80%;
		border-color: $footer-text-color;
	}

	#footer-container {
		margin-top: 64px;
	}
</style>
