<template>
  <div id="app">
      <TheNavbar />
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <router-view />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue';

export default {
  components: {
    TheNavbar
  },
}
</script>

<style>
@import "assets/css/style.css";
</style>
