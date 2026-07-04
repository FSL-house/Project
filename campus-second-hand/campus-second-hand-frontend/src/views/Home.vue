<template>
  <div class="page-container">
    <section class="page-section hero-grid">
      <div class="surface surface-pad hero-main">
        <h1 class="page-title hero-title">校园闲置好物</h1>

        <div class="hero-actions">
          <el-button type="primary" size="large" @click="router.push('/products')">逛商品</el-button>
          <el-button size="large" @click="handlePublish">发布商品</el-button>
        </div>
      </div>

      <div class="hero-side">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="label">当前商品</div>
            <div class="value">{{ productList.length }}</div>
          </div>
          <div class="summary-item">
            <div class="label">分类数量</div>
            <div class="value">{{ categoryList.length }}</div>
          </div>
          <div class="summary-item">
            <div class="label">卖家数量</div>
            <div class="value">{{ sellerCount }}</div>
          </div>
          <div class="summary-item">
            <div class="label">平台状态</div>
            <div class="value">在线</div>
          </div>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="section-head">
        <div>
          <h2>商品分类</h2>
        </div>
      </div>

      <div class="category-grid">
        <button
          v-for="item in categoryList"
          :key="item.id"
          type="button"
          class="category-tile"
          @click="goCategory(item.id)"
        >
          <div class="category-name">{{ item.name }}</div>
        </button>
      </div>
    </section>

    <section class="page-section">
      <div class="section-head">
        <div>
          <h2>最新商品</h2>
        </div>
        <el-button @click="router.push('/products')">查看全部</el-button>
      </div>

      <div v-loading="loading" class="product-panel">
        <div v-if="featuredProducts.length" class="grid-list">
          <ProductCard v-for="item in featuredProducts" :key="item.id" :product="item" />
        </div>
        <el-empty v-else-if="!loading" description="当前还没有可展示的商品" class="empty-box" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProductCard from '../components/ProductCard.vue'
import { getCategoryList, getProductList } from '../api/product'
import { getToken } from '../utils/auth'

const router = useRouter()
const categoryList = ref([])
const productList = ref([])
const loading = ref(false)

const featuredProducts = computed(() => productList.value.slice(0, 6))
const sellerCount = computed(() => new Set(productList.value.map((item) => item.sellerNickname)).size)

// 加载首页需要的分类和商品数据。
// 如果后端没启动或接口异常，只给出一条统一提示，避免重复弹窗影响体验。
async function loadHomeData() {
  loading.value = true
  try {
    const [categoryRes, productRes] = await Promise.all([
      getCategoryList({ silentError: true }),
      getProductList(undefined, { silentError: true })
    ])

    categoryList.value = categoryRes.data
    productList.value = productRes.data
  } catch (error) {
    ElMessage.error('首页数据加载失败，请确认后端服务是否正常运行')
  } finally {
    loading.value = false
  }
}

// 点击发布商品时，未登录用户先跳转到登录页。
function handlePublish() {
  if (!getToken()) {
    ElMessage.warning('请先登录后再发布商品')
    router.push('/login')
    return
  }

  router.push('/product/add')
}

// 点击分类卡片后，带着分类参数跳到商品列表页。
function goCategory(categoryId) {
  router.push({ path: '/products', query: { categoryId } })
}

onMounted(() => {
  loadHomeData()
})
</script>

<style scoped>
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
  gap: 20px;
}

.hero-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  padding: 32px 28px;
  background:
    radial-gradient(circle at top right, rgba(77, 182, 172, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(251, 253, 255, 0.92));
}

.hero-title {
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.hero-side {
  display: flex;
  align-items: stretch;
}

.hero-side .summary-grid {
  width: 100%;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.category-tile {
  text-align: left;
  border: 1px solid rgba(142, 156, 177, 0.18);
  background: rgba(255, 255, 255, 0.94);
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tile:hover {
  transform: translateY(-2px);
  border-color: rgba(21, 94, 239, 0.2);
  box-shadow: 0 16px 30px rgba(29, 41, 57, 0.08);
}

.category-name {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
}

.product-panel {
  min-height: 420px;
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}
</style>
