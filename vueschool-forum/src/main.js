import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AppDate from '@/components/AppDate.vue';

Vue.config.productionTip = false;

Vue.component('AppDate', AppDate);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
