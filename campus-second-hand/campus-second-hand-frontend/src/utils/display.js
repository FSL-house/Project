const productStatusMap = {
  PENDING: { label: '待审核', type: 'warning' },
  ON_SALE: { label: '在售中', type: 'success' },
  OFF_SALE: { label: '已下架', type: 'info' }
}

const orderStatusMap = {
  PENDING_DEAL: { label: '待交易', type: 'warning' },
  FINISHED: { label: '已完成', type: 'success' },
  CANCELLED: { label: '已取消', type: 'info' }
}

const roleMap = {
  ADMIN: '管理员',
  USER: '普通用户'
}

export function formatPrice(value) {
  return `￥${Number(value || 0).toFixed(2)}`
}

export function formatDate(value) {
  if (!value) {
    return '暂无时间'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

export function getProductStatusMeta(status) {
  return productStatusMap[status] || { label: status || '未知状态', type: 'info' }
}

export function getOrderStatusMeta(status) {
  return orderStatusMap[status] || { label: status || '未知状态', type: 'info' }
}

export function getRoleLabel(role) {
  return roleMap[role] || role || '未设置'
}
