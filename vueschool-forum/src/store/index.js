import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
  },
  getters,
  actions,
  mutations,
  modules: {}
});
