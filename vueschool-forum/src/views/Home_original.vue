<template>
  <div class="home">
    <PageHome msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import PageHome from "@/components/PageHome.vue";

export default {
  name: "Home",
  components: {
    PageHome
  }
};
</script>
