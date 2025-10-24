import { createRouter, createWebHistory } from 'vue-router'
import { FrontPage, AdminPageMain, AdminPageProjects, Resume, ResumeClient } from '../pages'

const routes = [
  { path: '/', name: 'Home', component: FrontPage },
  { path: '/resume', component: ResumeClient },
  { path: '/admin', name: 'AdminMain', component: AdminPageMain },
  { path: '/admin/projects', name: 'AdminProjects', component: AdminPageProjects },
  { path: '/admin/resume', name: 'AdminResume', component: Resume },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router


