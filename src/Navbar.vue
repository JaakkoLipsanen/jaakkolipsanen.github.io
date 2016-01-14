<template>
	<div id="navbar-container">
		<p id="header-text">{{ title }}</p>
	</div>
</template>

<script>
export default {
	data () {
		return {
			title: 'flai'
		}
	}
}
</script>

<style lang="sass">
	#navbar-container {
		width: 100%;
		height: 32px;
		background-color: rgb(100, 32, 64);
	}
	
	#header-text {
		color: red;
	}
</style>
