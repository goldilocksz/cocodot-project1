import axios from 'axios'
import { toast } from 'sonner'
import { debounce } from 'lodash'

export const request = axios.create({
  //baseURL: 'http://27.71.17.99:9090',
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

// 에러 처리 함수
const handleError = debounce((error: any) => {
  if (error.response && error.response.status === 401) {
    const errorMessage = error.response.data

    if (errorMessage === 'Authorization token missing or invalid') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error('토큰이 만료되어 자동 로그아웃 되였습니다.')
      alert('토큰이 만료되어 자동 로그아웃 되였습니다.')
      location.href = '/login'
    } else if (errorMessage === 'Token is invalid due to another login') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error('다른 장치에서 로그인하여 자동 로그아웃 되었습니다.')
      alert('다른 장치에서 로그인하여 자동 로그아웃 되었습니다.')
      location.href = '/login'
    }
  }

  return Promise.reject(
    error.code === 'ERR_NETWORK' ? '허용되지 않은 네트워크 접근입니다.' : error,
  )
}, 300) // 300ms 딜레이

// 응답 인터셉터
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    handleError(error) // 디바운스된 에러 핸들러 호출
  },
)

export default request
