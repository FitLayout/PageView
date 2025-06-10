<template>
    <div id="app" class="">
		<router-view></router-view>
    </div>
</template>

<script>
import {ApiClient} from './common/apiclient.js';
import {RdfUtil} from './common/rdfutil.js';

export default {
    name: 'app',
	data() {
		return {
			apiClient: null,
			rdfUtil: null
		}
	},
	components: {
	},
	created () {
		this.apiClient = new ApiClient();
		this.apiClient.onNotAuthorized = this.authFailed;
		this.rdfUtil = new RdfUtil(this.apiClient);
		window.rdfutil = this.rdfUtil; //TODO debuging
	},
	methods: {
		authFailed() {
			window.localStorage.setItem('redirect', '/browser/');
			if (this.apiClient.hasToken()) {
				this.apiClient.logout();
				window.localStorage.setItem('loginMsg', 'Your session has expired; please re-login.');
			}
			window.location.assign('/auth/#/login');
		}
	}
}
</script>

<style>
@import '@/assets/base.css';

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
.backlink {
	margin-bottom: 1.5em;
	font-weight: bold;
}
.backlink i {
	margin-right: 0.5em;
}
.backlink a {
	text-decoration: none;
}

.p-inputtext.ok.p-component {
    border-color: var(--p-green-500);
}

.badge {
	font-size: 75%;
	padding: 0.25em 0.4em;
	border-radius: 3px;
}
.boxtree .badge {
	color: white;
	background-color: var(--p-green-500);
}
.box .badge {
	color: white;
	background-color: var(--p-cyan-500);
}
.areatree .badge {
	color: black;
	background-color: var(--p-yellow-500);
}
.area .badge {
	color: black;
	background-color: var(--p-yellow-700);
}
.chunkset .badge {
	color: black;
	background-color: var(--p-indigo-200);
}
.textchunk .badge {
	color: white;
	background-color: var(--p-indigo-700);
}

/* Very important!!
  Solves flickering and freezing of tooltips in Google Chrome,
  which caused freezing of the whole browser.
*/
.p-tooltip {
	pointer-events: none;
}

#app {
	color: var(--p-text-color);
	background-color: var(--p-surface-50);
}
</style>
