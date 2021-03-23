
<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CategoryList from '@/components/CategoryList'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  // name: "Home", --> use name for recursive components!
  components: {
    CategoryList,
  },

  mixins: [asyncDataStatus],

  computed: {
    categories() {
      return Object.values(this.$store.state.categories)
    },
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums']),
  },

  // code BEFORE using mapActions (VUEX Actions)
  // beforeCreate() {
  // // Holds data on refresh page!!
  // this.$store.dispatch('fetchAllCategories').then(categories => {
  //   categories.forEach(category => {
  //       this.$store.dispatch('fetchForums', {ids: Object.keys(category.forums)})
  //     });
  //   })
  // }

  // code AFTER using mapActions
  created() {
    // Holds data on refresh page!!
    this.fetchAllCategories().then(categories => {
      Promise.all(
        categories.map(category =>
          this.fetchForums({ ids: Object.keys(category.forums) })
        )
      ).then(() => {
        this.asyncDataStatus_fetched()
      })
    })
  },
}
</script>