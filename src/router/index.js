import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import RepositoryView from "../views/RepositoryView.vue";
import RepositoryContentView from "../views/RepositoryContentView.vue";
import PageDetailView from "../views/PageDetailView.vue";
import BrowserView from "../views/BrowserView.vue";
import ExploreView from "../views/ExploreView.vue";
import QueryView from "../views/QueryView.vue";
import AdminView from "../views/AdminView.vue";
import AdminRepos from "../views/AdminRepos.vue";

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
				},
				{
					name: 'explore',
					path: 'explore/:iri?',
					component: ExploreView
				},
				{
					name: 'query',
					path: 'query',
					component: QueryView
				},
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
		},
		{
			path: '/admin',
			component: AdminView,
			children: [
				{
					name: 'adminHome',
					path: '',
					redirect: '/admin/repos'
				},
				{
					name: 'adminRepos',
					path: '/admin/repos',
					component: AdminRepos
				}
			]		
		}
	]
});

export default router;
