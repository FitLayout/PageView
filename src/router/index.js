import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home")
    },
    /*{
      name: "login",
      path: "/login",
      component: () => import("@/views/Login")
    },
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
      component: () => import("@/views/RepositoryView")
    },
    {
      name: "show",
      path: "/r/:repoId/show/:iri",
      component: () => import("@/views/RepositoryView")
    }
  ]
});
