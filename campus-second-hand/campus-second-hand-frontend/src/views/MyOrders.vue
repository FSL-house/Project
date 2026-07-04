<template>
  <div class="page-container">
    <section class="page-section">
      <div class="section-head">
        <div>
          <h1 class="page-title">我的订单</h1>
          <p class="page-subtitle">这里展示用户买入和卖出的订单，是交易链路里最能体现业务闭环的一页。</p>
        </div>
      </div>
    </section>

    <section class="page-section summary-grid">
      <div class="summary-item">
        <div class="label">买到的订单</div>
        <div class="value">{{ buyOrders.length }}</div>
      </div>
      <div class="summary-item">
        <div class="label">卖出的订单</div>
        <div class="value">{{ sellOrders.length }}</div>
      </div>
      <div class="summary-item">
        <div class="label">待交易订单</div>
        <div class="value">{{ pendingCount }}</div>
      </div>
    </section>

    <section class="page-section surface surface-pad table-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="我买到的" name="buy">
          <el-table :data="buyOrders" border style="width: 100%">
            <el-table-column prop="orderNo" label="订单编号" min-width="220" />
            <el-table-column prop="productTitle" label="商品标题" min-width="160" />
            <el-table-column prop="sellerNickname" label="卖家" width="120" />
            <el-table-column label="价格" width="120">
              <template #default="{ row }">
                {{ formatPrice(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="140">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusMeta(row.status).type" effect="light">
                  {{ getOrderStatusMeta(row.status).label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template #default="{ row }">
                <el-button size="small" type="success" :disabled="row.status !== 'PENDING_DEAL'" @click="changeStatus(row.id, 'FINISHED')">
                  完成订单
                </el-button>
                <el-button size="small" :disabled="row.status !== 'PENDING_DEAL'" @click="changeStatus(row.id, 'CANCELLED')">
                  取消订单
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我卖出的" name="sell">
          <el-table :data="sellOrders" border style="width: 100%">
            <el-table-column prop="orderNo" label="订单编号" min-width="220" />
            <el-table-column prop="productTitle" label="商品标题" min-width="160" />
            <el-table-column prop="buyerNickname" label="买家" width="120" />
            <el-table-column label="价格" width="120">
              <template #default="{ row }">
                {{ formatPrice(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="140">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusMeta(row.status).type" effect="light">
                  {{ getOrderStatusMeta(row.status).label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template #default="{ row }">
                <el-button size="small" type="success" :disabled="row.status !== 'PENDING_DEAL'" @click="changeStatus(row.id, 'FINISHED')">
                  完成订单
                </el-button>
                <el-button size="small" :disabled="row.status !== 'PENDING_DEAL'" @click="changeStatus(row.id, 'CANCELLED')">
                  取消订单
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyBuyOrders, getMySellOrders, updateOrderStatus } from '../api/order'
import { formatPrice, getOrderStatusMeta } from '../utils/display'

const activeName = ref('buy')
const buyOrders = ref([])
const sellOrders = ref([])

const pendingCount = computed(() => {
  return [...buyOrders.value, ...sellOrders.value].filter((item) => item.status === 'PENDING_DEAL').length
})

async function loadBuyOrders() {
  const res = await getMyBuyOrders()
  buyOrders.value = res.data
}

async function loadSellOrders() {
  const res = await getMySellOrders()
  sellOrders.value = res.data
}

async function changeStatus(orderId, status) {
  await updateOrderStatus({ orderId, status })
  ElMessage.success('订单状态修改成功')
  loadBuyOrders()
  loadSellOrders()
}

onMounted(() => {
  loadBuyOrders()
  loadSellOrders()
})
</script>
