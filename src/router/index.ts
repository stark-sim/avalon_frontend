import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/",
    component: () => import("../components/home/Home.vue"),
  },
  {
    path: "/room",
    component: () => import("../components/Room.vue"),
    props: (route: { query: { roomID: string } }) => ({
      roomID: route.query.roomID,
    }),
  },
  {
    path: "/game",
    component: () => import("../components/Game.vue"),
    props: (route: { query: { gameID: string } }) => ({
      gameID: route.query.gameID,
    }),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
