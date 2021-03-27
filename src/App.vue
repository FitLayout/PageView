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
.font-monospace {
	font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}
#app {
	font-family: var(--font-family);
	color: var(--text-color);
	background-color: var(--surface-a);
}
</style>
