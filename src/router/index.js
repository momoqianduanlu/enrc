import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/home.vue')
const WorkCard = () => import('../views/work-card.vue')
const NrcView = () => import('../views/nrc-view.vue')
const NrcCheck = () => import('../views/nrc-check.vue')
const Success = () => import('../views/success.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      name: 'enrc',
      arrow: false
    },
    component: Home
  },
  {
    path: '/work-card',
    name: 'word-card',
    meta: {
      name: '非例行工卡',
      arrow: true
    },
    component: WorkCard
  },
  {
    path: '/nrc-view',
    name: 'nrc-view',
    meta: {
      name: 'NRC数据库模板',
      arrow: true
    },
    component: NrcView
  },
  {
    path: '/nrc-check',
    name: 'nrc-check',
    meta: {
      name: 'NRC查询',
      arrow: true
    },
    component: NrcCheck
  },
  {
    path: '/success',
    name: 'success',
    meta: {
      name: 'success',
      arrow: true
    },
    component: Success
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
