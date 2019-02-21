<template>
  <section>
    <h1>Welcome</h1>
    <h2 v-if="!user">Getting user information...</h2>
    <h2 v-if="user">Hey, {{user.username}}</h2>
    <button @click="logout()" class="btn btn-primary">Log Out</button>
    <br>
    <br>
    <button @click="toggleForm()" class="btn btn-info">{{this.show}} Form</button>
    <br>
    <form v-if="showForm" @submit.prevent="addNote()">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          v-model="newNote.title"
          type="text"
          class="form-control"
          id="title"
          aria-describedby="titleHelp"
          placeholder="Enter a title"
          required
        >
        <small id="titleHelp" class="form-text text-muted">Enter a descriptive title for your note.</small>
      </div>
      <div class="form-group">
        <label for="note">Note</label>
        <textarea
          v-model="newNote.note"
          class="form-control"
          id="note"
          rows="3"
          placeholder="Enter your note..."
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-success">Add Note</button>
    </form>
    <section class="row mt-3">
      <div class="col-6" v-for="note in notes" :key="note._id">
        <div class="card text-white bg-secondary mb-3">
          <div class="card-header">
            <h1>{{note.title}}</h1>
          </div>
          <div class="card-body">
            <p class="card-text" v-html="renderMarkDown(note.note)"></p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import MarkdownIt from "markdown-it";
//the markdown is be able to add markdown to the note and it will render
const md = new MarkdownIt();

const API_URL = "http://localhost:5000/";

export default {
  data: () => ({
    user: null,
    showForm: false,
    show: "Show",
    newNote: {
      title: "",
      note: ""
    },
    notes: []
  }),
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.user) {
          this.user = result.user;
          this.getNotes();
        } else {
          this.logout();
        }
      });
  },
  methods: {
    renderMarkDown(note) {
      return md.render(note);
    },
    getNotes() {
      fetch(`${API_URL}api/v1/notes`, {
        headers: {
          authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(res => res.json())
        .then(notes => {
          this.notes = notes;
        });
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    addNote() {
      fetch(`${API_URL}api/v1/notes`, {
        method: "post",
        body: JSON.stringify(this.newNote),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(res => res.json())
        .then(note => {
          this.notes.push(note);
          this.newNote = {
            title: "",
            note: ""
          };
          this.toggleForm();
        });
    },
    toggleForm() {
      if (this.showForm) {
        // make the variable show the "hide form" and toggles to !this.showForm
        this.showForm = false;
        this.show = "Show";
      } else {
        // make the variable
        this.showForm = true;
        this.show = "Hide";
      }
    }
  }
};
</script>

<style>
.card {
  height: 90%;
}
.card-text img {
  width: 100%;
}
</style>
