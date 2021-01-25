import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import store from './store'
import AppDate from '@/components/AppDate.vue'

Vue.config.productionTip = false

Vue.component('AppDate', AppDate)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const  firebaseConfig = {
  apiKey: 'AIzaSyCmJMC2lXOUcr78VeG65Hm6s93Uk_DVQLw',
  authDomain: 'vue-school-forum-b5cf4.firebaseapp.com',
  databaseURL: 'https://vue-school-forum-b5cf4.firebaseio.com',
  projectId: 'vue-school-forum-b5cf4',
  storageBucket: 'vue-school-forum-b5cf4.appspot.com',
  messagingSenderId: '12692196306',
  appId: '1:12692196306:web:df811b3195335332b1160b',
  measurementId: 'G-CWCXN565J6'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// firebase.analytics()

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    store.dispatch('fetchUser', {id:store.state.authId})
  }
}).$mount('#app')
