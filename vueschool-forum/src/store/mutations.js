import Vue from 'vue'

const makeAppendChildToParentMutation = ({ parent, child }) =>
    (state, { childId, parentId }) => {
        const resource = state[parent][parentId];

        // If this is the first user post!
        if (!resource[child]) {
            Vue.set(resource, child, {});
        }

        Vue.set(resource[child], childId, childId);
    }

export default {
    // POSTS
    setPost(state, { post, postId }) {
        // Vue.set method accepts 3 arguments:
        // 1. object --> object we want to add the new property to
        // 2. propertyName --> name of the property
        // 3. value --> value of the property
        Vue.set(state.posts, postId, post);
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendPostToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'posts' }),

    // THREADS
    setThread(state, { thread, threadId }) {
        Vue.set(state.threads, threadId, thread);
    },
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),

    // USER PROFILE
    setUser(state, { user, userId }) {
        Vue.set(state.users, userId, user);
    },
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),

    setItem(state, { item, id, resource }) {
        item['.key'] = id
        Vue.set(state[resource], id, item);
    },
}