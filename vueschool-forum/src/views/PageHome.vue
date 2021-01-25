
<template>
  <div class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import CategoryList from '@/components/CategoryList'

export default {
  // name: "Home", --> use name for recursive components!
  components: {
    CategoryList
  },
  computed: {
    categories(){
      return Object.values(this.$store.state.categories);
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
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
      categories.forEach(category =>
        this.fetchForums({ids: category.forums})
      )
    })
  }

}
</script>