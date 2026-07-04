<template>
  <div class="auth-wrapper">
    <div class="auth-layout">
      <section class="auth-intro">
        <div class="soft-tag">
          <span class="badge-dot" />
          校园二手交易平台
        </div>
        <h1>先登录，再进入一个完整的校园交易闭环。</h1>
        <p>
          登录后可以发布商品、浏览收藏、查看订单，也可以用管理员账号进入后台工作台体验商品审核和平台统计功能。
        </p>

        <div class="auth-feature-list">
          <div class="auth-feature-item">
            <strong>用户端</strong>
            <span>商品发布、浏览搜索、收藏、下单</span>
          </div>
          <div class="auth-feature-item">
            <strong>管理端</strong>
            <span>用户查看、商品审核、订单总览、数据统计</span>
          </div>
        </div>
      </section>

      <el-card class="auth-card">
        <div class="auth-card-head">
          <h2>用户登录</h2>
          <p>输入账号密码后即可进入首页或后台。</p>
        </div>

        <el-form :model="form" label-position="top">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" @keyup.enter="handleLogin" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" style="width: 100%" size="large" @click="handleLogin">登录</el-button>
          </el-form-item>

          <div class="auth-footer-link">
            <el-button link @click="router.push('/register')">没有账号？去注册</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginUser } from '../api/user'
import { setToken, setUserInfo } from '../utils/auth'

const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

// 登录成功后，把 token 和用户信息保存到本地。
async function handleLogin() {
  const res = await loginUser(form)
  setToken(res.data.token)
  setUserInfo(res.data.userInfo)
  ElMessage.success('登录成功')

  if (res.data.userInfo.role === 'ADMIN') {
    router.push('/admin')
    return
  }

  router.push('/')
}
</script>

<style scoped>
.auth-layout {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 460px;
  gap: 24px;
  align-items: stretch;
}

.auth-intro {
  padding: 36px;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(77, 182, 172, 0.18), transparent 25%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.92));
  border: 1px solid rgba(142, 156, 177, 0.16);
  box-shadow: 0 16px 34px rgba(29, 41, 57, 0.07);
}

.auth-intro h1 {
  margin: 18px 0 0;
  font-size: 40px;
  line-height: 1.2;
  color: #1f2937;
}

.auth-intro p {
  margin: 18px 0 0;
  color: #667085;
  line-height: 1.9;
  max-width: 640px;
}

.auth-feature-list {
  margin-top: 28px;
  display: grid;
  gap: 14px;
}

.auth-feature-item {
  padding: 16px 18px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e8edf4;
}

.auth-feature-item strong {
  display: block;
  font-size: 15px;
  color: #1f2937;
}

.auth-feature-item span {
  display: block;
  margin-top: 6px;
  color: #667085;
}

.auth-card {
  width: 100%;
  border-radius: 20px;
}

.auth-card-head h2 {
  margin: 0;
  font-size: 28px;
}

.auth-card-head p {
  margin: 8px 0 20px;
  color: #667085;
}

.auth-footer-link {
  text-align: center;
}

@media (max-width: 960px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-intro h1 {
    font-size: 30px;
  }
}
</style>
