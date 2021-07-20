import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import RepositoryView from "../views/RepositoryView.vue";
import RepositoryContentView from "../views/RepositoryContentView.vue";
import PageDetailView from "../views/PageDetailView.vue";
import BrowserView from "../views/BrowserView.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			name: 'home',
			path: '/',
			component: Home
		},
		{
			path: '/r/:repoId',
			component: RepositoryView,
			children: [
				{
					name: 'repo',
					path: '',
					component: RepositoryContentView
				},
				{
					name: 'page',
					path: 'page/:iri',
					component: PageDetailView
				}
			]
		},
		{
			name: 'browser',
			path: '/b/:repoId',
			component: BrowserView
		},
		{
			name: 'show',
			path: '/b/:repoId/show/:iri',
			component: BrowserView
		}
	]
});

export default router;
