import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'HomeView',
            component: () => import('@/views/HomeView.vue')
        },
        {
            path: '/todo',
            name: 'TodoView',
            component: () => import('@/views/TodoView.vue')
        },
        {
            path: '/login',
            name: 'LoginView',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/join',
            name: 'JoinView',
            component: () => import('@/views/JoinView.vue')
        },
        {
            path: '/oauth/redirect',
            name: 'OauthRedirect',
            component: () => import('@/views/OauthRedirect.vue')
        },
        {
            path: '/chat',
            name: 'ChatView',
            component: () => import('@/views/ChatView.vue')
        }
    ]
});

export default router;
