<template>
  <div v-if="product" class="page-container">
    <section class="page-section two-column">
      <div class="surface image-panel">
        <img :src="getImageUrl(product.image)" alt="商品图片" class="detail-image" @error="handleImageError" />
      </div>

      <div class="surface surface-pad detail-side">
        <div class="soft-tag">
          <span class="badge-dot" />
          {{ statusMeta.label }}
        </div>

        <h1 class="page-title detail-title">{{ product.title }}</h1>
        <p class="page-subtitle">适合校园内部面对面交易，页面演示了商品详情、收藏和下单流程。</p>

        <div class="price-box">{{ formatPrice(product.price) }}</div>

        <div class="meta-list">
          <div class="meta-item">
            <span class="meta-label">分类</span>
            <span>{{ product.categoryName || '未分类' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">卖家</span>
            <span>{{ product.sellerNickname || '匿名卖家' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">发布时间</span>
            <span>{{ formatDate(product.createTime) }}</span>
          </div>
        </div>

        <div class="action-row">
          <el-button type="primary" size="large" @click="handleBuy">立即购买</el-button>
          <el-button size="large" @click="handleFavorite">收藏商品</el-button>
        </div>

        <div class="hint-panel">
          <div class="hint-title">交易建议</div>
          <ul>
            <li>建议在教学楼、图书馆或宿舍楼下等公开区域完成交易。</li>
            <li>线下见面时先确认商品情况，再完成付款。</li>
            <li>如商品信息不完整，可先联系卖家补充说明后再下单。</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="page-section surface surface-pad">
      <div class="section-head">
        <div>
          <h2>商品描述</h2>
          <p>这里用于展示商品的补充说明、使用情况、成色和适合人群。</p>
        </div>
      </div>
      <div class="description-block">{{ product.description || '卖家暂未填写商品描述。' }}</div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addFavorite } from '../api/favorite'
import { createOrder } from '../api/order'
import { getProductDetail } from '../api/product'
import { getToken } from '../utils/auth'
import { formatDate, formatPrice, getProductStatusMeta } from '../utils/display'
import { getFallbackImage, resolveProductImage } from '../utils/image'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const statusMeta = computed(() => getProductStatusMeta(product.value?.status))

function getImageUrl(image) {
  return resolveProductImage(image, product.value?.title || '商品图片', 'detail')
}

function handleImageError(event) {
  event.target.src = getFallbackImage(product.value?.title || '商品图片', 'detail')
}

async function loadDetail() {
  const res = await getProductDetail(route.params.id)
  product.value = res.data
}

function checkLogin() {
  if (!getToken()) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return false
  }
  return true
}

async function handleBuy() {
  if (!checkLogin()) return
  await createOrder(product.value.id)
  ElMessage.success('下单成功，请到我的订单查看')
  router.push('/orders')
}

async function handleFavorite() {
  if (!checkLogin()) return
  await addFavorite(product.value.id)
  ElMessage.success('收藏成功')
}

onMounted(loadDetail)
</script>

<style scoped>
.image-panel {
  padding: 16px;
}

.detail-image {
  width: 100%;
  min-height: 420px;
  max-height: 640px;
  object-fit: contain;
  border-radius: 14px;
  background: #f8fafc;
}

.detail-side {
  display: flex;
  flex-direction: column;
}

.detail-title {
  margin-top: 16px;
}

.price-box {
  margin-top: 22px;
  font-size: 40px;
  font-weight: 800;
  color: #f56c6c;
}

.meta-list {
  margin-top: 22px;
  display: grid;
  gap: 12px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2f6;
  color: #475467;
}

.meta-label {
  color: #667085;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.hint-panel {
  margin-top: 24px;
  padding: 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e9eef4;
}

.hint-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.hint-panel ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #667085;
  line-height: 1.9;
}

.description-block {
  color: #475467;
  line-height: 1.95;
  white-space: pre-wrap;
}
</style>
