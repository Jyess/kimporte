<template>
  <div>
    <div v-if="this.loadingArticle" class="text-center m-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else class="container mt-4">
      <h1 class="font-weight-bold">Mise à jour de l'article</h1>

      <hr />

      <form @submit="onSubmit" method="post">
        <div v-if="this.errorStatus == '401'" class="alert alert-danger" role="alert">
          Vous n'êtes pas autorisé à modifier cette article. Seul l'auteur peut le faire.
          <router-link to="/connexion">Connectez-vous</router-link>.
        </div>

        <div
          v-else-if="this.errorStatus !== null && this.errorStatus != '401'"
          class="alert alert-danger"
          role="alert"
        >Une erreur est survenue. Veuillez réessayer.</div>

        <div v-else-if="this.success" class="alert alert-success" role="alert">{{this.success}}</div>

        <div class="form-group">
          <label for="titre">Titre de l'article</label>
          <input v-model="article.title" type="text" class="form-control" id="titre" required />
        </div>

        <div class="form-group">
          <label for="contenu">Contenu de l'article</label>
          <textarea v-model="article.content" class="form-control" id="contenu" rows="3" required></textarea>
        </div>

        <button type="submit" class="btn btn-primary">
          Mettre à jour
          <span
            v-if="this.loadingButton"
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
  name: "UpdateArticle",
  data() {
    return {
      success: null,
      errorStatus: null,
      loadingArticle: null,
      loadingButton: null,
      id: this.$route.params.id,
      article: {
        title: "",
        content: ""
      },
      jwt: this.$store.state.token
    };
  },
  mounted() {
    this.getArticle();
  },
  methods: {
    getArticle() {
      this.loadingArticle = true;

      Axios({
        method: "get",
        url: "https://kimporte.herokuapp.com/api/articles/find/" + this.id
      })
        .then(response => {
          this.loadingArticle = false;
          if (response.data._id) {
            let articleToUpdate = response.data;
            this.article.title = articleToUpdate.title;
            this.article.content = articleToUpdate.content;
          }
        })
        .catch(error => {
          this.loadingArticle = false;
          console.log(error);
        });
    },
    onSubmit(e) {
      e.preventDefault();
      this.loadingButton = true;

      Axios({
        method: "post",
        url: "https://kimporte.herokuapp.com/api/articles/update",
        headers: {
          Authorization: this.jwt
        },
        data: {
          id: this.id,
          title: this.article.title,
          content: this.article.content
        }
      })
        .then(response => {
          this.loadingButton = false;
          this.success = response.data.response;
        })
        .catch(error => {
          this.loadingButton = false;
          this.errorStatus = error.response.status;
        });
    }
  }
};
</script>