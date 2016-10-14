<template>
	<div class="hamburger-menu-button-container">
		<img v-el:hamburger-menu-button  src="/icons/HamburgerMenuBlack.svg">
		<p> {{ text.toUpperCase() }}
	</div>
</template>

<script>

export default {
	props: {
		text: String
	},

	watch: {
		"text": function(value, oldValue) {
		}
	},

	ready: function() {
	}
};
</script>

<style lang="sass">

 .hamburger-menu-button-container > img  {
	height: 36%;
	min-height: 32px;

	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	margin-top: 0px;
	margin-left: 8px;

	cursor: pointer;
}

.hamburger-menu-button-container > p  {
	height: 36%;
	min-height: 32px;

	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	margin-top: 7px;
	margin-left: 46px;

	font-family: "Raleway";
	font-weight: 900;
}

</style>
