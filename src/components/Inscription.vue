<template>
  <div class="container mt-4">
    <div v-if="loggedin">
      <div class="alert alert-info" role="alert">Vous êtes déjà connecté.</div>
    </div>

    <div v-else>
      <h1 class="font-weight-bold">Inscription</h1>
      <hr />

      <form @submit="onSubmit" method="post">
        <div
          v-if="this.errorMessage == '400'"
          class="alert alert-danger"
          role="alert"
        >Ce compte existe déjà.</div>

        <div
          v-if="this.errorMessage !== null && this.errorMessage != '400'"
          class="alert alert-danger"
          role="alert"
        >Une erreur est survenue.</div>

        <div v-if="this.successMessage" class="alert alert-success" role="alert">
          {{ this.successMessage }}
          <router-link to="/connexion">Connectez-vous</router-link>.
        </div>

        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input v-model="user.username" type="text" class="form-control" id="username" required />
        </div>

        <div class="form-group">
          <label for="pwd">Mot de passe</label>
          <input v-model="user.password" type="password" class="form-control" id="pwd" required />
        </div>

        <button type="submit" class="btn btn-primary">
          S'inscrire
          <span
            v-if="this.loading"
            class="spinner-border spinner-border-sm ml-1"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  name: "Inscription",
  data() {
    return {
      loggedin: this.$store.state.token,
      loading: null,
      successMessage: null,
      errorMessage: null,
      user: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    onSubmit(e) {
      this.loading = true;
      e.preventDefault();
      this.inscription();
    },

    inscription() {
      Axios({
        method: "post",
        url: "https://kimporte.herokuapp.com/api/utilisateurs/add",
        data: {
          username: this.user.username,
          password: this.user.password
        }
      })
        .then(response => {
          this.loading = false;
          this.successMessage = response.data.response;
          this.errorMessage = null;
          this.user.username = "";
          this.user.password = "";
        })
        .catch(error => {
          this.loading = false;
          this.successMessage = null;
          this.user.username = "";
          this.user.password = "";
          this.errorMessage = error.response.status;
        });
    }
  }
};
</script>