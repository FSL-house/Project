import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getToken, getUserInfo } from '../utils/auth'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
  { path: '/products', name: 'products', component: () => import('../views/ProductList.vue') },
  { path: '/product/:id', name: 'product-detail', component: () => import('../views/ProductDetail.vue') },
  { path: '/product/add', name: 'product-add', component: () => import('../views/ProductAdd.vue'), meta: { requiresAuth: true } },
  { path: '/orders', name: 'orders', component: () => import('../views/MyOrders.vue'), meta: { requiresAuth: true } },
  { path: '/favorites', name: 'favorites', component: () => import('../views/MyFavorites.vue'), meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: () => import('../views/Admin.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 切换页面后自动回到顶部，让浏览体验更自然。
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由前置守卫。
// 用于判断页面是否需要登录，以及是否需要管理员权限。
router.beforeEach((to, from, next) => {
  const token = getToken()
  const userInfo = getUserInfo()

  if (to.meta.requiresAuth && !token) {
    ElMessage.warning('请先登录')
    next('/login')
    return
  }

  if (to.meta.requiresAdmin && userInfo?.role !== 'ADMIN') {
    ElMessage.error('只有管理员可以访问该页面')
    next('/')
    return
  }

  next()
})

export default router
