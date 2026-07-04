<template>
  <header class="header-shell">
    <div class="page-container header-inner">
      <div class="brand-box" @click="goHome">
        <div class="brand-mark">CS</div>
        <div>
          <div class="brand-title">校园二手交易平台</div>
          <div class="brand-subtitle">面向校园场景的轻量交易项目</div>
        </div>
      </div>

      <nav class="nav-list">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
          @click="router.push(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="user-box">
        <template v-if="token">
          <div class="user-pill">
            <div class="user-name">{{ userInfo?.nickname || userInfo?.username }}</div>
            <div class="user-role">{{ userInfo?.role === 'ADMIN' ? '管理员' : '普通用户' }}</div>
          </div>
          <el-button type="primary" plain @click="logout">退出登录</el-button>
        </template>

        <template v-else>
          <el-button @click="router.push('/login')">登录</el-button>
          <el-button type="primary" @click="router.push('/register')">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { clearLoginInfo, getToken, getUserInfo } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const token = computed(() => getToken())
const userInfo = computed(() => getUserInfo())

const navItems = computed(() => {
  const items = [
    { label: '首页', path: '/' },
    { label: '商品广场', path: '/products' }
  ]

  if (token.value) {
    items.push(
      { label: '发布商品', path: '/product/add' },
      { label: '我的订单', path: '/orders' },
      { label: '我的收藏', path: '/favorites' }
    )
  }

  if (userInfo.value?.role === 'ADMIN') {
    items.push({ label: '后台管理', path: '/admin' })
  }

  return items
})

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

function goHome() {
  router.push('/')
}

// 退出登录时清空本地登录信息，并回到登录页。
function logout() {
  clearLoginInfo()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.header-shell {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(142, 156, 177, 0.16);
}

.header-inner {
  min-height: 76px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  min-width: 0;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #155eef;
  background: linear-gradient(135deg, rgba(77, 182, 172, 0.14), rgba(21, 94, 239, 0.12));
}

.brand-title {
  font-size: 19px;
  font-weight: 800;
  color: #17212f;
}

.brand-subtitle {
  margin-top: 3px;
  color: #667085;
  font-size: 12px;
}

.nav-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-link {
  border: none;
  background: transparent;
  padding: 10px 14px;
  border-radius: 10px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(77, 182, 172, 0.1);
  color: #155eef;
}

.nav-link.active {
  background: #e9f1ff;
  color: #155eef;
}

.user-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.user-pill {
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e7ecf3;
  text-align: right;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.user-role {
  margin-top: 2px;
  font-size: 12px;
  color: #667085;
}

@media (max-width: 1100px) {
  .header-inner {
    grid-template-columns: 1fr;
    padding: 12px 0 16px;
  }

  .nav-list {
    justify-content: flex-start;
  }

  .user-box {
    justify-content: flex-start;
  }
}
</style>
