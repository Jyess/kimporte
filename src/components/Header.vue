<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <router-link class="navbar-brand font-weight-bold" to="/">Kimporte</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarResponsive"
      aria-controls="navbarResponsive"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Accueil</router-link>
        </li>

        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle active"
            href="/articles"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >Articles</a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" to="/create-article">Ajouter un article</router-link>
            <router-link class="dropdown-item" to="/articles">Voir tous les articles</router-link>
          </div>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <li v-if="!this.jwt" class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle active"
            href="/articles"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >S'identifier</a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" to="/connexion">Connexion</router-link>
            <router-link class="dropdown-item" to="/inscription">Inscription</router-link>
          </div>
        </li>

        <li v-else>
          <button @click="this.logout" type="button" class="btn btn-dark">Se déconnecter</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "CreateArticle",
  computed: {
    jwt() {
      return this.$store.state.token;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      this.$store.commit("jwt", "");
      alert("Vous avez été déconnecté.");
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    }
  }
};
</script>
