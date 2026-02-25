import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/pages/CalendarPage.vue') },
    { path: '/queue', component: () => import('@/pages/QueuePage.vue') },
    { path: '/compose', component: () => import('@/pages/ComposePage.vue') },
  ],
})
