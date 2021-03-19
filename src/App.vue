<template>
    <div id="app" class="">
	    <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
	methods: {
	},
	components: {
	}
}
</script>

<style>
html {
	font-size: 10pt;
}
#app {
	font-family: var(--font-family);
	color: var(--text-color);
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;*/
}
</style>
