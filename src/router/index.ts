import { createRouter, createWebHistory } from 'vue-router'
import { FrontPage } from '@/pages'
const routes = [
  { path: '/', name: 'Home', component: FrontPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

