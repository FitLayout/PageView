import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import RepositoryView from "../views/RepositoryView.vue";

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
			name: "show",
			path: "/r/:repoId/show/:iri",
			component: RepositoryView
		}
	]
});

export default router;
