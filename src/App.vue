<template>
  <div id="app">
    <h1>PageViewer</h1>
    <PageView />
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
