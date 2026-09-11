import axios from 'axios'
import { API_BASE_URL } from '@/constants/app'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from '@/utils/authStorage'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
})

let refreshPromise = null

function isAuthEndpoint(url = '') {
  const normalizedUrl = url.toLowerCase()

  return (
    normalizedUrl.includes('/auth/login') ||
    normalizedUrl.includes('/auth/register') ||
    normalizedUrl.includes('/auth/refresh-token') ||
    normalizedUrl.includes('/auth/reset-password')
  )
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available.')
  }

  const response = await axiosClient.post(
    '/Auth/refresh-token',
    {
      refreshToken,
    },
    {
      skipAuthRefresh: true,
    },
  )

  const responseData = response.data

  if (!responseData?.success || !responseData?.data) {
    throw new Error(
      responseData?.message || 'Unable to refresh session.',
    )
  }

  updateAccessToken(responseData.data)

  return responseData.data.accessToken
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token && !config.skipAuthHeader) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: 'Unable to connect to the server.',
      })
    }

    const status = error.response.status

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuthSession()
      window.dispatchEvent(
        new Event('invento:auth-expired'),
      )

      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newAccessToken = await refreshPromise

      originalRequest.headers = originalRequest.headers ?? {}

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`

      return axiosClient(originalRequest)
    } catch (refreshError) {
      refreshPromise = null
      clearAuthSession()

      window.dispatchEvent(
        new Event('invento:auth-expired'),
      )

      return Promise.reject(refreshError)
    }
  },
)

export default axiosClient