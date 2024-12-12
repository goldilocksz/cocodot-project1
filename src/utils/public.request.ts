import axios from 'axios'
import { toast } from 'sonner'

export const publicRequest = axios.create({
  //baseURL: 'http://27.71.17.99:9090',
  baseURL: '/api',
  timeout: 5000,
  headers: {
    Authorization: '',
  },
})

export default publicRequest
