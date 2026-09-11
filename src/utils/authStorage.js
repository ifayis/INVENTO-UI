import { STORAGE_KEYS } from '@/constants/storageKeys'
import { getUserFromAccessToken } from '@/utils/jwt'

const EXPIRES_AT_KEY = 'invento_expires_at'

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export function getStoredUser() {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER)
    return null
  }
}

export function getStoredExpiresAt() {
  return localStorage.getItem(EXPIRES_AT_KEY)
}

export function saveAuthSession(authData) {
  if (
    !authData?.accessToken ||
    !authData?.refreshToken
  ) {
    throw new Error(
      'Invalid authentication response.',
    )
  }

  const user = getUserFromAccessToken(
    authData.accessToken,
  )

  localStorage.setItem(
    STORAGE_KEYS.ACCESS_TOKEN,
    authData.accessToken,
  )

  localStorage.setItem(
    STORAGE_KEYS.REFRESH_TOKEN,
    authData.refreshToken,
  )

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user),
  )

  if (authData.expiresAt) {
    localStorage.setItem(
      EXPIRES_AT_KEY,
      authData.expiresAt,
    )
  } else {
    localStorage.removeItem(EXPIRES_AT_KEY)
  }

  return user
}

export function updateAccessToken(authData) {
  if (
    !authData?.accessToken ||
    !authData?.refreshToken
  ) {
    throw new Error(
      'Invalid token refresh response.',
    )
  }

  const user = getUserFromAccessToken(
    authData.accessToken,
  )

  localStorage.setItem(
    STORAGE_KEYS.ACCESS_TOKEN,
    authData.accessToken,
  )

  localStorage.setItem(
    STORAGE_KEYS.REFRESH_TOKEN,
    authData.refreshToken,
  )

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user),
  )

  if (authData.expiresAt) {
    localStorage.setItem(
      EXPIRES_AT_KEY,
      authData.expiresAt,
    )
  } else {
    localStorage.removeItem(EXPIRES_AT_KEY)
  }

  return user
}

export function clearAuthSession() {
  localStorage.removeItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  )

  localStorage.removeItem(
    STORAGE_KEYS.REFRESH_TOKEN,
  )

  localStorage.removeItem(
    STORAGE_KEYS.USER,
  )

  localStorage.removeItem(EXPIRES_AT_KEY)
}