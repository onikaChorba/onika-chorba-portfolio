import { createRouter, createWebHistory } from 'vue-router'
import { FrontPage, AdminPage } from '../pages'

const routes = [
  { path: '/', name: 'Home', component: FrontPage },
  { path: '/admin', name: 'Admin', component: AdminPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router


