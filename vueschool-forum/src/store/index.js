import Vue from "vue";
import Vuex from "vuex";
import sourceData from '@/data';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
  },
  getters: {
    authUser(state){
      return state.users[state.authId];
    }
  },
  mutations: {
    // POSTS
    setPost(state, {post, postId}){
      // Vue.set method accepts 3 arguments:
      // 1. object --> object we want to add the new property to
      // 2. propertyName --> name of the property
      // 3. value --> value of the property
      Vue.set(state.posts, postId, post);
    },
    appendPostToThread(state, {postId, threadId}) {
      const thread = state.threads[threadId];

      // If this is the first user post!
      if (!thread.posts) {
        Vue.set(thread, 'posts', {});
      }

      Vue.set(thread.posts, postId, postId);
    },
    appendPostToUser(state, {userId, postId}){
      const user = state.users[userId];

      // If this is the first user post!
      if (!user.posts) {
        Vue.set(user, 'posts', {});
      }

      Vue.set(user.posts, postId, postId);
    },

    // THREADS
    setThread(state, {thread, threadId}){
      Vue.set(state.threads, threadId, thread);
    },
    appendThreadToForum(state, {forumId, threadId}) {
      const forum = state.forums[forumId];
      
      if (!forum.threads) {
        Vue.set(forum, 'threads', {});
      }

      Vue.set(forum.threads, threadId, threadId);
    },
    appendThreadToUser(state, {userId, threadId}){
      const user = state.users[userId];
      
      if (!user.threads) {
        Vue.set(user, 'threads', {});
      }
      
      Vue.set(user.threads, threadId, threadId);
    },

    // USER PROFILE
    setUser(state, {user, userId}){
      Vue.set(state.users, userId, user);
    },
  },
  actions: {
    // POSTS
    createPost({commit, state}, post){
      const postId = `greatPost${Math.random()}`;
      post['.key'] = postId;
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now()/1000);

      commit('setPost', { post, postId});
      commit('appendPostToThread', {threadId: post.threadId, postId});
      commit('appendPostToUser', {userId: post.userId, postId});

      return Promise.resolve(state.posts[postId]);
    },
    updatePost({state, commit}, {id, text}) {
      return new Promise((resolve/*, reject*/) => {
        const post = state.posts[id];

        commit('setPost', {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now()/1000),
              by: state.authId 
            }
          }
        });

        resolve(post);
      });
    },

    // THREADS
    createThread({commit, state}, {title, text, forumId}){
      // To get newly created ID of thread we need to return promise
      return new Promise((resolve/*, reject*/) => {
        const threadId = `greatThread${Math.random()}`;
        const userId = state.authId;
        const publishedAt = Math.floor(Date.now()/1000);
        // Create new thread object
        const thread = {
          '.key': threadId,
          forumId,
          title,
          publishedAt,
          userId
        };
  
        commit('setThread', { thread, threadId});
        commit('appendThreadToForum', {forumId, threadId});
        commit('appendThreadToUser', {userId, threadId});
  
        this.dispatch('createPost', {text, threadId}).then(post => {
          commit('setThread', { threadId, thread: {...thread, firstPostId: post['.key']}});
        });

        resolve(state.threads[threadId]);
      });
    },
    updateThread({state, commit}, {title, text, id}) {
      return new Promise((resolve/*, reject*/) => {
        // Current thread and post
        const thread = state.threads[id];
        // const post = state.posts[thread.firstPostId];
        // New thread and post
        const newThread = {...thread, title};
        // const newPost = {...post, text};
  
        commit('setThread', { thread: newThread, threadId: id});
        // commit('setPost', { post: newPost, postId: thread.firstPostId});

        resolve(newThread);
      });
    },

    // USER PROFILE
    updateUser({commit}, user){
      commit('setUser', {userId: user['.key'], user});
    }
  },
  modules: {}
});
