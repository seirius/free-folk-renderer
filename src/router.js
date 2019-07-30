import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
    routes: [
      {
        path: '/',
        name: 'youtube',
        component: () => import(/* webpackChunkName: "youtube" */ './views/Youtube.vue')
      },
      {
          path: "/video/:name/:type",
          name: "video-view",
          props: true,
          component: () => import("./views/VideoView.vue")
      },
      {
          path: "/test-web",
          name: "test-web",
          component: () => import("./views/TestWeb.vue")
      }
    ]
  })
