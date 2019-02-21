<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">Auth for Noobs</a>
      <div id="navbarColor01" class="navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" :to="{name: 'home'}">
              Home
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{name: this.routeLink}"
              v-on:click.native="toggleLogin"
            >
              {{this.login}}
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container pt-2"/>
  </div>
</template>

<script>
export default {
  data: () => ({
    loggedIn: false,
    login: "Log In",
    routeLink: "login"
  }),
  mounted() {
    setTimeout(() => {
      if (localStorage.token) {
        this.login = "Log Out";
        return true;
      } else {
        this.login = "Log In";
        return false;
      }
    }, 500);
  },
  methods: {
    toggleLogin() {
      if (this.login === "Log Out" && localStorage.token) {
        this.logout();
        this.login = "Log In";
      } else {
        this.login = "Log Out";
      }
    },
    checkToken() {},
    logout() {
      console.log("logout being called");
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style>
</style>
