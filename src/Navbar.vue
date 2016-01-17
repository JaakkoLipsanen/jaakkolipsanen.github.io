<template>
	<div id="navbar-container">
		<p id="navbar-header-text">{{ title }}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			title: "flai"
		};
	}
};
</script>

<style lang="sass">
	@import url(https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz);

	$font-stack: 'Yanone Kaffeesatz', 'Segoe UI';
	$light-gray: rgb(211, 211, 211);

	#navbar-container {
		width: 100%;
		height: 48px;
	}

	#navbar-header-text {
		color: $light-gray;
		font: 400% $font-stack;

		text-align: center;
		margin: auto;
	}
</style>
