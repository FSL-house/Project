<template>
  <article class="product-card" @click="goDetail">
    <div class="cover-wrap">
      <img :src="getImageUrl(product.image)" class="cover" alt="商品图片" @error="handleImageError" />
      <div class="cover-top">
        <el-tag size="small" effect="light">{{ product.categoryName || '未分类' }}</el-tag>
        <el-tag v-if="showStatus" size="small" :type="statusMeta.type" effect="light">
          {{ statusMeta.label }}
        </el-tag>
      </div>
    </div>

    <div class="content">
      <div class="title">{{ product.title }}</div>
      <div class="desc">{{ product.description || '卖家暂时还没有补充商品描述。' }}</div>

      <div class="meta-row">
        <span>{{ product.sellerNickname || '匿名卖家' }}</span>
        <span>{{ displayTime }}</span>
      </div>

      <div class="bottom-row">
        <div class="price">{{ formatPrice(product.price) }}</div>
        <span class="view-link">查看详情</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getFallbackImage, resolveProductImage } from '../utils/image'
import { formatDate, formatPrice, getProductStatusMeta } from '../utils/display'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showStatus: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const statusMeta = computed(() => getProductStatusMeta(props.product.status))
const displayTime = computed(() => formatDate(props.product.createTime))

// 兼容本地静态图片路径和网络图片地址。
function getImageUrl(image) {
  return resolveProductImage(image, props.product.title, 'card')
}

// 图片加载失败时，自动回退到默认占位图。
function handleImageError(event) {
  event.target.src = getFallbackImage(props.product.title, 'card')
}

function goDetail() {
  router.push(`/product/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(142, 156, 177, 0.18);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 32px rgba(29, 41, 57, 0.08);
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 42px rgba(29, 41, 57, 0.12);
}

.cover-wrap {
  position: relative;
  padding: 12px 12px 0;
}

.cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 12px;
  background: #eff3f8;
  display: block;
}

.cover-top {
  position: absolute;
  top: 22px;
  left: 22px;
  right: 22px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}

.title {
  font-size: 18px;
  line-height: 1.35;
  font-weight: 700;
  color: #1f2937;
}

.desc {
  margin-top: 10px;
  color: #667085;
  font-size: 14px;
  line-height: 1.7;
  min-height: 48px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta-row {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #8a94a6;
  font-size: 12px;
}

.bottom-row {
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.price {
  font-size: 28px;
  line-height: 1;
  font-weight: 800;
  color: #f56c6c;
}

.view-link {
  color: #155eef;
  font-size: 14px;
  font-weight: 700;
}
</style>
