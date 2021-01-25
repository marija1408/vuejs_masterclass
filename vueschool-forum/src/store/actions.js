import firebase from 'firebase'

export default {
    // THREADS
    createThread({ state, commit, dispatch }, { title, text, forumId }) {
        // To get newly created ID of thread we need to return promise
        return new Promise((resolve, reject) => {
            const threadId = firebase.database().ref('threads').push().key
            const postId = firebase.database().ref('posts').push().key
            const userId = state.authId;
            const publishedAt = Math.floor(Date.now() / 1000);
            // Create new thread object
            const thread = { title, forumId, publishedAt, userId, firstPostId: postId, posts: {} }
            // append post to thread
            thread.posts[postId] = postId
            const post = { text, publishedAt, threadId, userId }
            const updates = {}

            // set thread
            updates[`threads/${threadId}`] = thread
            // append to forum
            updates[`forums/${forumId}/threads/${threadId}`] = threadId
            // append to user
            updates[`users/${userId}/threads/${threadId}`] = threadId

            // set post
            updates[`posts/${postId}`] = post
            // append to user
            updates[`users/${userId}/posts/${postId}`] = postId

            firebase.database().ref().update(updates).then(() => {
                // update thread
                // commit('setThread', { thread, threadId });
                commit('setItem', { resource: 'threads', item: thread, id: threadId })
                commit('appendThreadToForum', { parentId: forumId, childId: threadId })
                commit('appendThreadToUser', { parentId: userId, childId: threadId })
                // update post
                commit('setItem', { resource: 'posts', item: post, id: postId })
                commit('appendPostToThread', { parentId: post.threadId, childId: postId })
                commit('appendPostToUser', { parentId: post.userId, childId: postId })

                resolve(state.threads[threadId])
            })

        });
    },

    updateThread({ state, commit, dispatch }, { title, text, id }) {
        return new Promise((resolve, reject) => {
            // Current thread and post
            const thread = state.threads[id];
            // New thread and post
            const post = state.posts[thread.firstPostId]

            
            // update post
            const edited = {
                at: Math.floor(Date.now() / 1000),
                by: state.authId
            }
            
            
            const updates = { text, edited }
            // post and thread has a differents paths so we need to define each of them
            updates[`posts/${thread.firstPostId}/text`] = text
            updates[`posts/${thread.firstPostId}/edited`] = edited
            updates[`threads/${id}/title`] = title

            firebase.database().ref().update(updates).then(() => {
                commit('setThread', { thread: {...thread, title}, threadId: id });
                commit('setPost', { postId: thread.firstPostId, post: { ...post, text, edited } })
                resolve(post)
            })

            // // Actions run async, we should wait for the updatePost to complete and then resolve the promise!!
            // dispatch('updatePost', { id: thread.firstPostId, text }).then(() => {
            //     resolve(newThread);
            // });

        });
    },


    // POSTS
    createPost({ commit, state }, post) {
        const postId = firebase.database().ref('posts').push().key
        post.userId = state.authId;
        post.publishedAt = Math.floor(Date.now() / 1000);

        const updates = {}
        // path to the post as key
        // set post
        updates[`posts/${postId}`] = post
        // appent to thread
        updates[`threads/${post.threadId}/posts/${postId}`] = postId
        // append to contributor
        updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
        // append to user
        updates[`users/${post.userId}/posts/${postId}`] = postId

        firebase.database().ref().update(updates).then(() => {
            // commit('setPost', { post, postId });
            commit('setItem', { resource: 'posts', item: post, id: postId });
            commit('appendPostToThread', { parentId: post.threadId, childId: postId });
            commit('appendContributorToThread', { parentId: post.threadId, childId: post.userId });
            commit('appendPostToUser', { parentId: post.userId, childId: postId });

            return Promise.resolve(state.posts[postId]);
        })

    },

    updatePost({ state, commit }, { id, text }) {
        return new Promise((resolve, reject) => {
            const post = state.posts[id]
            const edited = {
                at: Math.floor(Date.now() / 1000),
                by: state.authId
            }

            
            const updates = { text, edited }
            firebase.database().ref('posts').child(id).update(updates).then(() => {
                commit('setPost', { postId: id, post: { ...post, text, edited } })
                resolve(post)
            })

        })
    },


    // USER PROFILE
    updateUser({ commit }, user) {
        commit('setUser', { userId: user['.key'], user });
    },


    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷️' }),
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🌧️' }),
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' }),
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' }),
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♀️' }),

    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷️' }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '🌧️' }),
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }),
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋‍♀️' }),


    fetchAllCategories({ state, commit }) {
        console.log('🔥', '🏷️', 'all')

        return new Promise((resolve, reject) => {
            firebase.database().ref('categories').once('value', snapshot => {
                const categoriesObject = snapshot.val()

                Object.keys(categoriesObject).forEach(categoryId => {
                    const category = categoriesObject[categoryId]
                    commit('setItem', { resource: 'categories', id: categoryId, item: category })
                })
                resolve(Object.values(state.categories))
            })
        })
    },

    fetchItem({ state, commit }, { id, emoji, resource }) {
        console.log('🔥', emoji, id)

        return new Promise((resolve, reject) => {
            firebase.database().ref(resource).child(id).once('value', snapshot => {
                commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
                resolve(state[resource][id])
            })
        })
    },

    fetchItems({ dispatch }, { ids, resource, emoji }) {
        ids = Array.isArray(ids) ? ids : Object.keys(ids)
        return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
    }
}