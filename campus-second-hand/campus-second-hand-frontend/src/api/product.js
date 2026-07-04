import request from '../utils/request'

export function getCategoryList(config = {}) {
  return request.get('/category/list', config)
}

export function addProduct(data) {
  return request.post('/product/add', data)
}

export function getProductList(params, config = {}) {
  return request.get('/product/list', { params, ...config })
}

export function getProductDetail(id) {
  return request.get(`/product/detail/${id}`)
}

export function getMyProducts() {
  return request.get('/product/my')
}
