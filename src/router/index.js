import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import RepositoryView from "../views/RepositoryView.vue";
import PageDetailView from "../views/PageDetailView.vue";
import BrowserView from "../views/BrowserView.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			name: "home",
			path: "/",
			component: Home
		},
		/*
		{
		name: "register",
		path: "/register",
		component: () => import("@/views/Register")
		},
		{
		name: "settings",
		path: "/settings",
		component: () => import("@/views/Settings")
		},*/
		{
			name: "repo",
			path: "/r/:repoId",
			component: RepositoryView
		},
		{
			name: "page",
			path: "/r/:repoId/page/:iri",
			component: PageDetailView
		},
		{
			name: "browser",
			path: "/b/:repoId",
			component: BrowserView
		},
		{
			name: "show",
			path: "/b/:repoId/show/:iri",
			component: BrowserView
		}
	]
});

export default router;
