import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import { clearLoginInfo, getToken } from './auth'

// Axios 实例。
// 开发环境默认通过 Vite 代理访问 /api，生产环境也可以继续走同域名反向代理。
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 统一提取更友好的错误提示，避免直接暴露底层英文报错。
function getErrorMessage(error) {
  const response = error.response
  const backendMessage = response?.data?.message

  if (backendMessage) {
    return backendMessage
  }

  if (!response) {
    return '无法连接后端服务，请确认 Spring Boot 已启动'
  }

  if (response.status === 500) {
    return '后端服务异常，请确认后端已启动并检查控制台日志'
  }

  if (response.status === 404) {
    return '请求的接口不存在，请检查前后端地址配置'
  }

  if (response.status === 401) {
    return '登录状态已失效，请重新登录'
  }

  return '请求失败，请稍后重试'
}

// 请求拦截器：自动在请求头中携带 token。
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.token = token
  }
  return config
})

// 响应拦截器：统一处理后端返回结构和异常提示。
request.interceptors.response.use(
  (response) => {
    const result = response.data
    if (result.code === 200) {
      return result
    }

    ElMessage.error(result.message || '请求失败')

    if (result.code === 401) {
      clearLoginInfo()
      router.push('/login')
    }

    return Promise.reject(new Error(result.message || '请求失败'))
  },
  (error) => {
    if (!error.config?.silentError) {
      ElMessage.error(getErrorMessage(error))
    }
    return Promise.reject(error)
  }
)

export default request
