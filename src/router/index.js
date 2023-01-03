import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: ()=>import('../components/Login.vue')
    },
    {
        path: '/home',
        name: "home",
        component: ()=>import('../components/HelloWorld.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router