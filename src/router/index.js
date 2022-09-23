import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/Homepage.vue'
import UserProfile from '@/views/UserProfile.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/user/:username',
            props: true,
            name: 'userProfile',
            component: UserProfile,
        },
        {
            path: '/user/:username/:page',
            props: true,
            name: 'userProfilePagination',
            component: UserProfile,
        },
        {
            path: '/:page',
            props: true,
            name: 'homePagination',
            component: HomePage,
        },
        { path: '/:notFound(.*)', redirect: '/' },
    ],
})

export default router
