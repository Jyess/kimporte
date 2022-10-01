<template>
  <div>
    <div v-if="this.loading" class="text-center m-5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else class="container mt-4">
      <div class="col" v-if="article">
        <div v-if="this.deleteErrorStatus == '401'" class="alert alert-danger" role="alert">
          Vous n'êtes pas autorisé à supprimer cette article. Seul l'auteur peut le faire.
          <router-link to="/connexion">Connectez-vous</router-link>
        </div>

        <div
          v-else-if="this.deleteErrorStatus !== null && this.deleteErrorStatus != '401'"
          class="alert alert-danger"
          role="alert"
        >Une erreur est survenue lors de la suppression de l'article. Merci de réessayer.</div>

        <h2 class="font-weight-bold">{{ article.title }}</h2>
        <hr />
        <small class="text-muted font-italic">&Eacute;crit par {{ article.username }}</small>
        <p class="my-2 text-break">{{ article.content }}</p>

        <div class="row">
          <router-link
            type="button"
            class="btn btn-info mx-2 py-1"
            v-bind:to="{ path: '/update-article/' + article._id, params: { 
            id: article._id, 
            title: article.title, 
            content: article.content }}"
          >Modifer</router-link>

          <button @click="this.delete" type="button" class="btn btn-danger mx-2 py-1">
            Supprimer
            <span
              v-if="this.loading"
              class="spinner-border spinner-border-sm ml-1"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
        </div>
      </div>

      <div v-else class="alert alert-danger" role="alert">Impossible de récupérer l'article.</div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  name: "Article",
  data() {
    return {
      loading: null,
      deleteErrorStatus: null,
      article: JSON,
      id: this.$route.params.id,
      jwt: this.$store.state.token
    };
  },
  mounted() {
    this.loading = true;
    this.getArticle();
  },
  methods: {
    getArticle() {
      Axios({
        method: "get",
        url: "https://kimporte.herokuapp.com/api/articles/find/" + this.id
      })
        .then(response => {
          this.loading = false;
          this.article = null;
          if (response.data._id) {
            this.article = response.data;
          }
        })
        .catch(error => {
          this.loading = false;
          this.article = null;
          console.log(error);
        });
    },
    delete() {
      this.loading = true;

      let choice = confirm(
        "Etes-vous sûr de vouloir supprimer cette article ?"
      );

      if (choice) {
        Axios({
          method: "get",
          url: "https://kimporte.herokuapp.com/api/articles/delete/" + this.id,
          headers: {
            Authorization: this.jwt
          }
        })
          .then(response => {
            this.loading = false;
            alert(response.data.response);
            if (this.$route.path != "/articles") {
              this.$router.push("/articles");
            }
          })
          .catch(error => {
            this.loading = false;
            this.deleteErrorStatus = error.response.status;
          });
      }
    }
  }
};
</script>
