<template>
  <div class="auth-wrapper">
    <div class="auth-layout">
      <section class="auth-intro">
        <div class="soft-tag">
          <span class="badge-dot" />
          创建你的校园交易账号
        </div>
        <h1>注册后就能发布商品、收藏心仪物品，并体验完整的下单流程。</h1>
        <p>这个页面演示了项目的注册模块，同时也是用户进入商品平台的第一步。</p>
      </section>

      <el-card class="auth-card">
        <div class="auth-card-head">
          <h2>用户注册</h2>
          <p>填写基础信息后即可创建新账号。</p>
        </div>

        <el-form :model="form" label-position="top">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
          </el-form-item>

          <el-form-item label="昵称">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" style="width: 100%" size="large" @click="handleRegister">注册账号</el-button>
          </el-form-item>

          <div class="auth-footer-link">
            <el-button link @click="router.push('/login')">已有账号？去登录</el-button>
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
import { registerUser } from '../api/user'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  nickname: '',
  phone: ''
})

async function handleRegister() {
  await registerUser(form)
  ElMessage.success('注册成功，请登录')
  router.push('/login')
}
</script>

<style scoped>
.auth-layout {
  width: min(1080px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 460px;
  gap: 24px;
  align-items: stretch;
}

.auth-intro {
  padding: 36px;
  border-radius: 20px;
  background:
    radial-gradient(circle at top left, rgba(255, 205, 86, 0.16), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.92));
  border: 1px solid rgba(142, 156, 177, 0.16);
  box-shadow: 0 16px 34px rgba(29, 41, 57, 0.07);
}

.auth-intro h1 {
  margin: 18px 0 0;
  font-size: 38px;
  line-height: 1.2;
  color: #1f2937;
}

.auth-intro p {
  margin: 18px 0 0;
  color: #667085;
  line-height: 1.9;
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
