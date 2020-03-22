import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

import Connexion from "./components/Connexion.vue";
import Inscription from "./components/Inscription.vue";
import Article from "./components/Article.vue";
import Articles from "./components/Articles.vue";
import CreateArticle from "./components/CreateArticle.vue";
import UpdateArticle from "./components/UpdateArticle.vue";

Vue.config.productionTip = false;

const routes = [
  {
    path: "/",
    component: Articles
  },
  {
    path: "/connexion",
    component: Connexion
  },
  {
    path: "/inscription",
    component: Inscription
  },
  {
    path: "/articles",
    component: Articles
  },
  {
    path: "/create-article",
    component: CreateArticle
  },
  {
    path: "/update-article/:id",
    component: UpdateArticle
  },
  {
    path: "/article/:id",
    component: Article
  }
];

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    storedArticles: [],
    token: localStorage.getItem("jwt")
  },
  mutations: {
    articles(state, articlesDB) {
      state.storedArticles = articlesDB;
    },
    jwt(state, JSONWebToken) {
      state.token = JSONWebToken;
    }
  }
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
