import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import SignUp from "./views/SignUp.vue";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";

Vue.use(Router);

const loggedInRedirectDashboard = (to, from, next) => {
  if (localStorage.token) {
    next("/dashboard");
  } else {
    next();
  }
};

const isLoggedIn = (to, from, next) => {
  if (localStorage.token) {
    next();
  } else {
    next("/login");
  }
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: loggedInRedirectDashboard
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp,
      beforeEnter: loggedInRedirectDashboard
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter: loggedInRedirectDashboard
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: isLoggedIn
    }
  ]
});
