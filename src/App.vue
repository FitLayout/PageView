<template>
    <div id="app" class="">
	    <router-view></router-view>
    </div>
</template>

<script>
import {ApiClient} from '@/common/apiclient.js';

export default {
    name: 'app',
	data() {
		return {
			apiClient: null
		}
	},
	components: {
	},
	created () {
		this.apiClient = new ApiClient();
		this.apiClient.onNotAuthorized = this.authFailed;
	},
	methods: {
		authFailed() {
			this.$router.push({name: 'login'});
		}
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

.p-inputtext.ok.p-component {
    border-color: var(--green-500);
}

.badge {
	font-size: 75%;
	padding: 0.25em 0.4em;
	border-radius: 3px;
}
.boxtree .badge {
	color: white;
	background-color: var(--green-500);
}
.box .badge {
	color: white;
	background-color: var(--cyan-500);
}
.areatree .badge {
	color: black;
	background-color: var(--yellow-500);
}
.area .badge {
	color: black;
	background-color: var(--yellow-700);
}


#app {
	font-family: var(--font-family);
	color: var(--text-color);
	background-color: var(--surface-a);
}
</style>
