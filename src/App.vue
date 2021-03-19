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
body {
	margin: 0;
	padding: 0;
}
.h-100 {
	height: 100%;
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#app {
	font-family: var(--font-family);
	color: var(--text-color);
}
</style>
