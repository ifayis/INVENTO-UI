import axios from 'axios'
import { API_BASE_URL } from '@/constants/app'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: 'Unable to connect to the server.',
      })
    }

    return Promise.reject(error)
  },
)

export default axiosClient