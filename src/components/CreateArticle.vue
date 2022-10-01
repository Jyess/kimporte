<template>
  <div class="container mt-4">
    <h1 class="font-weight-bold">Créer un article</h1>
    <hr />

    <div v-if="this.errorStatus == '401'" class="alert alert-danger" role="alert">
      Vous devez être connecté pour créer un article.
      <router-link to="/connexion">Connectez-vous</router-link>&nbsp;ou
      <router-link to="/inscription">créez un compte</router-link>.
    </div>

    <div
      v-else-if="this.errorStatus !== null && this.errorStatus != '401'"
      class="alert alert-danger"
      role="alert"
    >Une erreur est survenue. Veuillez réessayer.</div>

    <div v-else-if="this.success" class="alert alert-success" role="alert">
      L'article a bien été créé.
      <router-link to="/articles">Voir les articles</router-link>.
    </div>

    <form @submit="onSubmit" method="post">
      <div class="form-group">
        <label for="titre">Titre de l'article</label>
        <input type="text" class="form-control" v-model="article.title" id="titre" required />
      </div>

      <div class="form-group">
        <label for="contenu">Contenu de l'article</label>
        <textarea class="form-control" id="contenu" rows="3" v-model="article.content" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        Créer
        <span
          v-if="this.loading"
          class="spinner-border spinner-border-sm ml-1"
          role="status"
          aria-hidden="true"
        ></span>
      </button>
    </form>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  name: "CreateArticle",
  data() {
    return {
      loading: null,
      success: null,
      errorStatus: null,
      article: {
        title: "",
        content: ""
      },
      jwt: this.$store.state.token
    };
  },
  methods: {
    onSubmit(e) {
      this.loading = true;
      e.preventDefault();
      this.createArticle();
    },

    createArticle() {
      Axios({
        method: "post",
        url: "https://kimporte.herokuapp.com/api/articles/add",
        headers: {
          Authorization: this.jwt
        },
        data: {
          title: this.article.title,
          content: this.article.content
        }
      })
        .then(response => {
          this.success = response;
          this.article.title = "";
          this.article.content = "";
          this.loading = false;
        })
        .catch(error => {
          this.errorStatus = error.response.status;
          this.loading = false;
        });
    }
  }
};
</script>
