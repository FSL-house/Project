<template>
  <div class="page-wrap">
    <div class="surface not-found-page">
      <div class="not-found-mark">404</div>
      <h1>页面走丢了</h1>
      <p>你访问的页面不存在，可能已经被移动，或者地址输入错了。</p>
      <div class="not-found-actions">
        <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
        <el-button @click="$router.push('/products')">去逛商品</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  padding: 40px 24px;
}

.not-found-mark {
  font-size: 72px;
  font-weight: 800;
  color: #3b82f6;
  line-height: 1;
}

h1 {
  margin: 0;
  font-size: 32px;
  color: #111827;
}

p {
  margin: 0;
  font-size: 15px;
  color: #6b7280;
}

.not-found-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
