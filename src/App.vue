<template>
  <div id="app" class="container-fluid">

	<nav class="navbar navbar-light bg-light bg-gradient">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">FitLayout</a>
		</div>
	</nav>

	<router-view></router-view>
    <!--<PageView artifactIri="http://fitlayout.github.io/resource/art1" />-->
  </div>
</template>

<script>
import PageView from './components/PageView.vue'

export default {
  name: 'app',
  components: {
    PageView
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
