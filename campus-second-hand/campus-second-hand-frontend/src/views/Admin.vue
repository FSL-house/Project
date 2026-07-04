<template>
  <div class="page-container">
    <section class="page-section">
      <div class="section-head">
        <div>
          <h1 class="page-title">后台管理</h1>
          <p class="page-subtitle">这里集中展示管理员最常用的三类信息：平台概览、商品审核和订单总览。</p>
        </div>
      </div>
    </section>

    <section class="page-section summary-grid">
      <div class="summary-item">
        <div class="label">用户总数</div>
        <div class="value">{{ stats.userCount || 0 }}</div>
      </div>
      <div class="summary-item">
        <div class="label">商品总数</div>
        <div class="value">{{ stats.productCount || 0 }}</div>
      </div>
      <div class="summary-item">
        <div class="label">待审核商品</div>
        <div class="value">{{ stats.pendingProductCount || 0 }}</div>
      </div>
      <div class="summary-item">
        <div class="label">订单总数</div>
        <div class="value">{{ stats.orderCount || 0 }}</div>
      </div>
    </section>

    <section class="page-section surface surface-pad table-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="users">
          <el-table :data="users" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" min-width="140" />
            <el-table-column prop="nickname" label="昵称" min-width="120" />
            <el-table-column prop="phone" label="手机号" min-width="140" />
            <el-table-column label="角色" width="120">
              <template #default="{ row }">
                <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'info'" effect="light">
                  {{ getRoleLabel(row.role) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="商品审核" name="products">
          <el-table :data="products" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="商品标题" min-width="180" />
            <el-table-column prop="categoryName" label="分类" width="120" />
            <el-table-column prop="sellerNickname" label="发布人" width="120" />
            <el-table-column label="价格" width="120">
              <template #default="{ row }">
                {{ formatPrice(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getProductStatusMeta(row.status).type" effect="light">
                  {{ getProductStatusMeta(row.status).label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template #default="{ row }">
                <el-button size="small" type="success" @click="changeProductStatus(row.id, 'ON_SALE')">审核通过</el-button>
                <el-button size="small" type="danger" @click="changeProductStatus(row.id, 'OFF_SALE')">下架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="订单总览" name="orders">
          <el-table :data="orders" border>
            <el-table-column prop="orderNo" label="订单编号" min-width="220" />
            <el-table-column prop="productTitle" label="商品标题" min-width="180" />
            <el-table-column prop="buyerNickname" label="买家" width="120" />
            <el-table-column prop="sellerNickname" label="卖家" width="120" />
            <el-table-column label="价格" width="120">
              <template #default="{ row }">
                {{ formatPrice(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusMeta(row.status).type" effect="light">
                  {{ getOrderStatusMeta(row.status).label }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getAdminOrders,
  getAdminProducts,
  getAdminStats,
  getAdminUsers,
  updateAdminProductStatus
} from '../api/admin'
import { formatPrice, getOrderStatusMeta, getProductStatusMeta, getRoleLabel } from '../utils/display'

const activeName = ref('users')
const stats = reactive({})
const users = ref([])
const products = ref([])
const orders = ref([])

async function loadStats() {
  const res = await getAdminStats()
  Object.assign(stats, res.data)
}

async function loadUsers() {
  const res = await getAdminUsers()
  users.value = res.data
}

async function loadProducts() {
  const res = await getAdminProducts()
  products.value = res.data
}

async function loadOrders() {
  const res = await getAdminOrders()
  orders.value = res.data
}

async function changeProductStatus(productId, status) {
  await updateAdminProductStatus({ productId, status })
  ElMessage.success('商品状态修改成功')
  loadProducts()
  loadStats()
}

onMounted(() => {
  loadStats()
  loadUsers()
  loadProducts()
  loadOrders()
})
</script>
