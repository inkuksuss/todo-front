import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //   path: '/',
        //   name: 'home',
        //   component: HomeView
        // },
        {
            path: '/todo',
            name: 'TodoView',
            component: () => import('@/views/TodoView.vue')
        },
        {
            path: '/login',
            name: 'LoginView',
            component: () => import('@/views/LoginView.vue')
        }
    ]
});

export default router;
