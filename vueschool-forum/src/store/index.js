import Vue from "vue";
import Vuex from "vuex";
import sourceData from '@/data';
import {countObjectProperties} from '@/utils';

Vue.use(Vuex);

const makeAppendChildToParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId];

    // If this is the first user post!
    if (!resource[child]) {
      Vue.set(resource, child, {});
    }

    Vue.set(resource[child], childId, childId);
  }

export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
  },

  getters: {
    authUser(state){
      return state.users[state.authId];
    },

    /** ARROW FUNCTION - same as this:
     *     userPostsCount(state){
            return function(id){
              return countObjectProperties(state.users[id].posts);
            }
          }
     */
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1

  },

  actions: {
    // POSTS
    createPost({commit, state}, post){
      const postId = `greatPost${Math.random()}`;
      post['.key'] = postId;
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now()/1000);

      commit('setPost', { post, postId});
      commit('appendPostToThread', {parentId: post.threadId, childId: postId});
      commit('appendPostToUser', {parentId: post.userId, childId: postId});

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
    createThread({state, commit, dispatch}, {title, text, forumId}){
      // To get newly created ID of thread we need to return promise
      return new Promise((resolve/*, reject*/) => {
        const threadId = `greatThread${Math.random()}`;
        const userId = state.authId;
        const publishedAt = Math.floor(Date.now()/1000);
        // Create new thread object
        const thread = {
          '.key': threadId,
          title,
          forumId,
          publishedAt,
          userId
        };
  
        commit('setThread', { thread, threadId});
        commit('appendThreadToForum', {parentId: forumId, childId: threadId});
        commit('appendThreadToUser', {parentId: userId, childId: threadId});
  
        dispatch('createPost', {text, threadId}).then(post => {
          commit('setThread', { threadId, thread: {...thread, firstPostId: post['.key']}});
        });

        resolve(state.threads[threadId]);
      });
    },
    updateThread({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve/*, reject*/) => {
        // Current thread and post
        const thread = state.threads[id];
        // New thread and post
        const newThread = {...thread, title};
  
        commit('setThread', { thread: newThread, threadId: id});

        // Actions run async, we should wait for the updatePost to complete and then resolve the promise!!
        dispatch('updatePost', {id: thread.firstPostId, text}).then(() => {
          resolve(newThread);
        });

      });
    },

    // USER PROFILE
    updateUser({commit}, user){
      commit('setUser', {userId: user['.key'], user});
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
    appendPostToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),
    appendPostToUser: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),

    // THREADS
    setThread(state, {thread, threadId}){
      Vue.set(state.threads, threadId, thread);
    },
    appendThreadToForum: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'}),
    appendThreadToUser: makeAppendChildToParentMutation({parent: 'users', child: 'threads'}),

    // USER PROFILE
    setUser(state, {user, userId}){
      Vue.set(state.users, userId, user);
    },
  },

  modules: {}
});
