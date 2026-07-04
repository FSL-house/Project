<template>
  <div class="page-container">
    <section class="page-section">
      <div class="section-head">
        <div>
          <h1 class="page-title">我的收藏</h1>
          <p class="page-subtitle">收藏列表可以帮助用户沉淀感兴趣的商品，也是校园交易平台里非常典型的个人页面功能。</p>
        </div>
      </div>
    </section>

    <section class="page-section summary-grid">
      <div class="summary-item">
        <div class="label">收藏商品数</div>
        <div class="value">{{ favoriteList.length }}</div>
      </div>
      <div class="summary-item">
        <div class="label">最近可浏览商品</div>
        <div class="value">{{ favoriteList.length ? '有' : '暂无' }}</div>
      </div>
    </section>

    <section class="page-section">
      <div v-if="favoriteList.length" class="grid-list">
        <div v-for="item in favoriteList" :key="item.id" class="favorite-item">
          <ProductCard :product="item" />
          <div class="favorite-actions">
            <el-button type="danger" plain @click="handleCancel(item.id)">取消收藏</el-button>
          </div>
        </div>
      </div>
      <el-empty v-else description="你还没有收藏商品" class="empty-box" />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { cancelFavorite, getMyFavorites } from '../api/favorite'
import ProductCard from '../components/ProductCard.vue'

const favoriteList = ref([])

async function loadFavorites() {
  const res = await getMyFavorites()
  favoriteList.value = res.data
}

async function handleCancel(productId) {
  await cancelFavorite(productId)
  ElMessage.success('已取消收藏')
  loadFavorites()
}

onMounted(loadFavorites)
</script>

<style scoped>
.favorite-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
