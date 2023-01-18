import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/',
    name: "home",
    component: () => import('../components/home/Home.vue')
  },
  {
    path: "/room",
    name: "room",
    component: () => import('../components/Room.vue'),
    props: (route: { query: { roomID: string } }) => ({ roomID: route.query.roomID })
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router