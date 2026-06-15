import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { CommonResCfg } from '@/types/requestType'
import { logger } from '@/utils/logger'
import { baseUrl } from '@/config/env'

// 创建一个局部的axios
const http = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 注册请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    logger.info(
      `请求拦截器 - 发送请求: 请求地址：${(config.baseURL || '') + (config.url || '')}\n请求类型：${config.method}\n完整配置：`,
      config,
    )
    return config
  },
  (error) => {
    logger.warn(`请求拦截器 - 执行异常：${error.message ?? '未知错误'}`)
    return Promise.reject(error)
  },
)

/**
 * 安全解析 JSON：在 JSON.parse 前将超长整数（16 位及以上）转换为字符串
 *  避免精度限制导致的大整数精度丢失
 */
function safeJsonParse(text: string) {
  const safe = text.replace(/(:\s*|\[\s*|,\s*)(\d{16,})(\s*[,}\]])/g, '$1"$2"$3')
  return JSON.parse(safe)
}

// 注册响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config?.responseType === 'text' && typeof response.data === 'string') {
      response.data = safeJsonParse(response.data)
    }
    logger.info(
      `响应拦截器 - 收到响应:\n后端响应信息, ${response.data?.message || '无提示'}, \n响应来源：${(response.config.baseURL || '') + (response.config.url || '')}, '\n完整响应：`,
      response,
    )
    return response.data
  },
  (error): Promise<CommonResCfg> => {
    if (error.response) {
      logger.warn('响应拦截器 - 收到错误响应:', error.response.status, error.response.data?.message)
      return Promise.reject({
        code: error.response.status,
        message: error.response.data?.message || '请求失败',
        data: error.response.data || {},
      })
    }
    return Promise.reject({
      code: -1,
      message: '网络连接不稳定，请检查网络环境，错误信息:' + (error.message || ''),
      data: {},
    })
  },
)

function axiosRequest<Res = Record<string, unknown>>(options: AxiosRequestConfig) {
  const controller = new AbortController()
  const config: AxiosRequestConfig = {
    ...options,
    // method: 'GET',
    signal: controller.signal,
  }
  const promise = http.request(config) as Promise<CommonResCfg<Res>>
  return {
    promise,
    controller,
  }
}

const json = {
  get: <Res = Record<string, unknown>>(url: string, options: AxiosRequestConfig) => {
    return axiosRequest<Res>({
      ...options,
      url,
      method: 'GET',
    })
  },
  post: <Res = Record<string, unknown>>(url: string, options: AxiosRequestConfig) => {
    return axiosRequest<Res>({
      ...options,
      url,
      method: 'POST',
    })
  },
  put: <Res = Record<string, unknown>>(url: string, options: AxiosRequestConfig) => {
    return axiosRequest<Res>({
      ...options,
      url,
      method: 'PUT',
    })
  },
  delete: <Res = Record<string, unknown>>(url: string, options: AxiosRequestConfig) => {
    return axiosRequest<Res>({
      ...options,
      url,
      method: 'DELETE',
    })
  },
}

const file = {
  upload: () => {},

  download: () => {},
}
export const request = {
  json,
  // file,
}
