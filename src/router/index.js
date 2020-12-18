import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: '/editor/chart-list'
  },
  {
    path: "",
    redirect: '/editor/chart-list'
  },
  {
      name: 'editor',
      path: '/editor',
      component: Home,
      children: [
        {
          name: 'editor-chart-list',
          path: 'chart-list',
          component: () => import('../views/Editor/chart-list.vue'),
          meta: {
            title: '可视化列表',
          },
        },
        {
          name: 'editor-chart',
          path: 'chart',
          component: () => import('../views/Editor/chart.vue'),
          meta: {
            title: '可视化展示',
          },
        },

      ],
    },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
