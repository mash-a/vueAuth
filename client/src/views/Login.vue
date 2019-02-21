<template>
  <section>
    <div v-if="loggingIn">
      <img src="../assets/loadingGear.svg">
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}</div>
    <form v-if="!loggingIn" @submit.prevent="login()">
      <h1>Login</h1>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Enter a username"
          aria-describedby="usernameHelp"
          required
        >
        <small id="username" class="form-text text-muted">Enter your username to login.</small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          aria-describedby="passwordHelp"
          required
        >
        <small id="password" class="form-text text-muted">Enter your password.</small>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi';
// import GearLoader from '../assets/loadingGear.svg';

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .min(10)
    .trim()
    .required(),
});

export default {
  name: 'login',
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
    loggingIn: false,
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        this.loggingIn = true;
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            // telling server that we are sending json data
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }

            return response.json().then((err) => {
              throw new Error(err.message);
            });
          })
          .then((result) => {
            // it worked, valid info, logged in
            localStorage.token = result.token;
            setTimeout(() => {
              this.loggingIn = false;
              this.$router.push('/dashboard');
            }, 1000);
          })
          .catch((err) => {
            setTimeout(() => {
              this.loggingIn = false;
              this.errorMessage = err.message;
            }, 1000);
          });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }

      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid.';
      } else {
        this.errorMessage = 'Password is invalid.';
      }
      return false;
    },
  },
};
</script>

<style>
</style>
