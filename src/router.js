import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'youtube',
//       // route level code-splitting
//       // this generates a separate chunk (about.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import(/* webpackChunkName: "youtube" */ './views/Youtube.vue')
//     },
//     {
//       path: "/converter",
//       name: "converter",
//       component: () => import(/* webpackChunkName: "converter" */ './views/Converter.vue')
//     },
//     {
//       path: "/torrent",
//       name: "torrent",
//       component: () => import(/* webpackChunkName: "converter" */ './views/Torrent.vue')
//     }
//   ]
// });

export default new Router({
    routes: [
      {
        path: '/',
        name: 'youtube2',
        component: () => import(/* webpackChunkName: "youtube" */ './views/Youtube2.vue')
      }
    ]
  })
