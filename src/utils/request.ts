import axios from 'axios'

interface Props {
  url: string
  body?: any
  headers?: any
}

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
    return Promise.reject(
      error.code === 'ERR_NETWORK'
        ? '허용되지 않은 네트워크 접근입니다.'
        : error,
    )
  },
)

export default request
