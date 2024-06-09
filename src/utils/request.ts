import axios from 'axios'
import { toast } from 'sonner'

export const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem('token')
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error('토큰이 만료되어 자동 로그아웃 되였습니다.')
      window.location.href = '/login'
    }

    return Promise.reject(
      error.code === 'ERR_NETWORK'
        ? '허용되지 않은 네트워크 접근입니다.'
        : error,
    )
  },
)

export default request
