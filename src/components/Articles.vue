<template>
  <div class="container mt-4">
    <h1 class="font-weight-bold">Tous les articles</h1>
    <hr />

    <div v-if="this.loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="col" v-if="storedArticles">
      <Article
        v-for="article in articles"
        v-bind:key="article._id"
        v-bind:_id="article._id"
        v-bind:username="article.username"
        v-bind:title="article.title"
        v-bind:content="article.content"
      ></Article>
    </div>

    <div v-else-if="articles" class="col">
      <Article
        v-for="article in articles"
        v-bind:key="article._id"
        v-bind:_id="article._id"
        v-bind:username="article.username"
        v-bind:title="article.title"
        v-bind:content="article.content"
      ></Article>
    </div>

    <div
      v-if="this.error"
      class="alert alert-danger"
      role="alert"
    >Impossible de récupérer les articles.</div>
  </div>
</template>

<script>
import Article from "./UnArticle";
import Axios from "axios";

export default {
  name: "Articles",
  components: {
    Article
  },
  data() {
    return {
      loading: null,
      error: "",
      articles: JSON
    };
  },
  mounted() {
    this.loading = true;
    this.getArticles();
  },
  computed: {
    storedArticles() {
      return this.$store.state.storedArticles;
    }
  },
  methods: {
    getArticles() {
      Axios({
        method: "get",
        url: "https://kimporte.herokuapp.com/api/articles"
      })
        .then(response => {
          this.articles = response.data;
          this.$store.commit("articles", this.articles);
          this.loading = null;
        })
        .catch(error => {
          this.articles = null;
          this.loading = null;
          this.error = error;
        });
    }
  }
};
</script>
