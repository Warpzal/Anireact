import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HomePage from '@/views/Homepage.vue'
import MyProfile from '@/views/MyProfile.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/gallery',
            name: 'gallery',
            component: HomePage,
        },
        {
            path: '/me',
            name: 'myProfile',
            component: MyProfile,
        },
    ],
})

export default router
