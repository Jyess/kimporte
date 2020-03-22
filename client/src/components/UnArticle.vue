<template>
  <div class="my-4">
    <h2 class="m-0">
      <router-link v-bind:to="{ path: '/article/' + _id, params: { id: _id }}">{{ title }}</router-link>
    </h2>
    <small class="text-muted font-italic">&Eacute;crit par {{ username }}</small>
    <p class="my-2 text-break">{{ content }}</p>
  </div>
</template>

<script>
export default {
  name: "Article",
  props: {
    _id: String,
    username: String,
    title: String,
    content: String
  }
};
</script>