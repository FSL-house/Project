<template>
  <div class="page-container">
    <section class="page-section">
      <div class="section-head">
        <div>
          <h1 class="page-title">商品广场</h1>
          <p class="page-subtitle">支持按分类筛选、关键词搜索和简单排序，适合演示一个完整的校园交易浏览流程。</p>
        </div>
      </div>
    </section>

    <section class="page-section surface surface-pad">
      <div class="filter-bar">
        <el-select v-model="categoryId" placeholder="选择分类" clearable style="width: 200px">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-input v-model="keyword" placeholder="输入商品关键词，例如 教材、充电宝、台灯" clearable style="width: 320px" @keyup.enter="loadProducts" />
        <el-select v-model="sortMode" style="width: 180px">
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="priceAsc" />
          <el-option label="价格从高到低" value="priceDesc" />
          <el-option label="最新发布优先" value="latest" />
        </el-select>
        <el-button type="primary" @click="loadProducts">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <div class="result-bar">
        <div class="muted-text">共找到 <strong>{{ displayProducts.length }}</strong> 件商品</div>
        <div class="result-tags">
          <span v-if="categoryId" class="soft-tag">已按分类筛选</span>
          <span v-if="keyword" class="soft-tag">关键词：{{ keyword }}</span>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div v-loading="loading" class="product-panel">
        <div v-if="displayProducts.length" class="grid-list">
          <ProductCard v-for="item in displayProducts" :key="item.id" :product="item" />
        </div>
        <el-empty v-else-if="!loading" description="没有找到符合条件的商品" class="empty-box" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { getCategoryList, getProductList } from '../api/product'

const route = useRoute()
const categoryList = ref([])
const productList = ref([])
const categoryId = ref('')
const keyword = ref('')
const sortMode = ref('default')
const loading = ref(false)

const displayProducts = computed(() => {
  const list = [...productList.value]

  if (sortMode.value === 'priceAsc') {
    return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
  }

  if (sortMode.value === 'priceDesc') {
    return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
  }

  if (sortMode.value === 'latest') {
    return list.sort((a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0))
  }

  return list
})

async function loadCategories() {
  const res = await getCategoryList()
  categoryList.value = res.data
}

async function loadProducts() {
  loading.value = true
  try {
    const res = await getProductList({
      categoryId: categoryId.value || undefined,
      keyword: keyword.value || undefined
    })
    productList.value = res.data
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  categoryId.value = ''
  keyword.value = ''
  sortMode.value = 'default'
  loadProducts()
}

watch(
  () => route.query.categoryId,
  (value) => {
    if (value) {
      categoryId.value = Number(value)
      loadProducts()
    }
  },
  { immediate: true }
)

onMounted(() => {
  loadCategories()
  if (route.query.keyword) {
    keyword.value = route.query.keyword
  }
  if (!route.query.categoryId) {
    loadProducts()
  }
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

.result-bar {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.result-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.product-panel {
  min-height: 460px;
}
</style>
