import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/PageHome.vue";
import ThreadShow from '@/views/PageThreadShow';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/PageCategory'),
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import('@/views/PageForum.vue'),
    props: true
  },
  {
    path: "/thread/create/:forumId",
    name: "ThreadCreate",
    component: () => import('@/views/PageThreadCreate.vue'),
    props: true
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: () => import('@/views/PageThreadEdit.vue'),
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/PageProfile.vue'),
    props: true
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('@/views/PageProfile.vue'),
    props: {
      edit: true
    }
  },
  {
    path: '*',
    name: 'NotFound',
    // lazy-load
    component: () =>
    import('@/views/PageNotFound')  
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
