<template>
  <section>
    <div v-if="signingUp">
      <img src="../assets/loadingGear.svg">
    </div>
    <form @submit.prevent="signup" v-if="!signingUp">
      <h1>Sign Up</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}</div>
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
        <small id="username" class="form-text text-muted">
          Username must be longer than 2 characters and shorter than 30 characters.
          Username can only contain alphanumeric characters and underscores.
        </small>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
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
          <small
            id="password"
            class="form-text text-muted"
          >Password must be 10 or more characters long.</small>
        </div>
        <div class="form-group col-md-6">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            placeholder="Password"
            aria-describedby="confirmPasswordHelp"
            required
          >
          <small id="confirmPassword" class="form-text text-muted">Please confirm password.</small>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi';
// import GearLoader from "../assets/loadingGear.svg";

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

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
  confirmPassword: Joi.string()
    .min(10)
    .trim()
    .required(),
});

export default {
  name: 'signup',
  data: () => ({
    errorMessage: '',
    signingUp: false,
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        // send data to server
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        this.signingUp = true;
        fetch(SIGNUP_URL, {
          method: 'POST',
          // need to turn the body into a string so it can be sent over the HTTP request
          body: JSON.stringify(body),
          headers: {
            // telling server that text data is being sent that is formated as json
            'content-type': 'application/json',
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }

            return res.json().then((err) => {
              throw new Error(err.message);
            });
          })
          .then((result) => {
            localStorage.token = result.token;
            setTimeout(() => {
              this.signingUp = false;
              this.$router.push('/dashboard');
            }, 1000);
          })
          .catch((err) => {
            setTimeout(() => {
              this.signingUp = false;
              this.errorMessage = err.message;
            }, 1000);
          });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match.';
        return false;
      }
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
