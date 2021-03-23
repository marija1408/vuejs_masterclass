<template>
  <div id="app">
    <TheNavbar />
    <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <div class="container">
      <router-view v-show="showPage" @ready="pageReady" />
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import NProgress from 'nprogress'

export default {
  components: {
    TheNavbar,
    AppSpinner,
  },

  data() {
    return {
      showPage: false,
    }
  },

  methods: {
    pageReady() {
      this.showPage = true
      NProgress.done()
    },
  },

  created() {
    NProgress.configure({
      speed: 200,
      showSpinner: false,
    })
    NProgress.start()

    this.$router.beforeEach((to, from, next) => {
      this.showPage = false

      NProgress.start()

      next()
    })
  },
}
</script>

<style>
@import 'assets/css/style.css';
@import '~nprogress/nprogress.css';

#nprogress .bar {
  background: #57ad8d;
}
</style>
