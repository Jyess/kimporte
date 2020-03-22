<template>
  <div class="container mt-4">
    <div v-if="loggedin">
      <div class="alert alert-info" role="alert">Vous êtes déjà connecté.</div>
    </div>

    <div v-else>
      <h1 class="font-weight-bold">Connexion</h1>
      <hr />

      <form @submit="onSubmit" method="post">
        <div v-if="this.errorMessage" class="alert alert-danger" role="alert">{{this.errorMessage}}</div>

        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input type="text" class="form-control" id="username" v-model="user.username" required />
        </div>

        <div class="form-group">
          <label for="pwd">Mot de passe</label>
          <input type="password" class="form-control" id="pwd" v-model="user.password" required />
        </div>

        <button type="submit" class="btn btn-primary">
          Se connecter
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
  name: "Connexion",
  data() {
    return {
      loggedin: localStorage.getItem("jwt"),
      loading: null,
      success: null,
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
      this.connexion();
    },

    connexion() {
      Axios({
        method: "post",
        url: "https://kimporte.herokuapp.com/api/utilisateurs/login",
        data: {
          username: this.user.username,
          password: this.user.password
        }
      })
        .then(response => {
          this.loading = false;
          this.errorMessage = null;
          this.success = response.data.jwt;
          let jwt = "Bearer " + this.success;
          localStorage.setItem("jwt", jwt);
          this.$store.commit("jwt", jwt);
          if (this.$route.path != "/") {
            this.$router.push("/");
          }
          alert("Vous êtes connecté. Bienvenue !");
        })
        .catch(error => {
          this.loading = false;
          this.success = null;
          this.user.password = "";
          this.errorMessage = error.response.data.error;
        });
    }
  }
};
</script>
