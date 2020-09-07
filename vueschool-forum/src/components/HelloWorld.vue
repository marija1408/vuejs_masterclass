
<template>
  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <ThreadList :threads="threads"/>
  </div>

  <!-- <div>
    <h1>Welcome to the forum</h1>
    <div v-for="thread in threads" v-bind:key="thread.id">
      <h2>{{thread.title}}</h2>
      <div v-for="postId in thread.posts" v-bind:key="postId">
        <p>{{users[posts[postId].userId].name}}</p>
        <p>{{posts[postId].text}}</p>
      </div>
    </div>
  </div>-->
</template>

<script>
import sourceData from "@/data";
import ThreadList from './ThreadList'

console.log(sourceData);

export default {
  // name: "HelloWorld", --> use name for recursive components!
  components: {
    ThreadList
  },
  data() {
    return {
      threads: Object.values(sourceData.threads),
      posts: sourceData.posts,
      users: sourceData.users
    };
  }
};
</script>
