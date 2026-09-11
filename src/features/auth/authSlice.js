import { createSlice } from '@reduxjs/toolkit'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  getStoredExpiresAt,
  saveAuthSession,
  updateAccessToken,
} from '@/utils/authStorage'

const initialState = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  expiresAt: getStoredExpiresAt(),
  user: getStoredUser(),
  isAuthenticated: Boolean(
    getAccessToken() && getRefreshToken(),
  ),
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const authData = action.payload

      const user = saveAuthSession(authData)

      state.accessToken = authData.accessToken
      state.refreshToken = authData.refreshToken
      state.expiresAt = authData.expiresAt ?? null
      state.user = user
      state.isAuthenticated = true

      if (
        typeof authData.mustChangePassword === 'boolean'
      ) {
        state.user = {
          ...state.user,
          mustChangePassword:
            authData.mustChangePassword,
        }

        localStorage.setItem(
          'invento_user',
          JSON.stringify(state.user),
        )
      }
    },

    updateCredentials: (state, action) => {
      const authData = action.payload

      const existingMustChangePassword =
        state.user?.mustChangePassword ?? false

      const user = updateAccessToken(authData)

      state.accessToken = authData.accessToken
      state.refreshToken = authData.refreshToken
      state.expiresAt = authData.expiresAt ?? null
      state.user = {
        ...user,
        mustChangePassword:
          typeof authData.mustChangePassword === 'boolean'
            ? authData.mustChangePassword
            : existingMustChangePassword,
      }

      localStorage.setItem(
        'invento_user',
        JSON.stringify(state.user),
      )

      state.isAuthenticated = true
    },

    clearCredentials: (state) => {
      clearAuthSession()

      state.accessToken = null
      state.refreshToken = null
      state.expiresAt = null
      state.user = null
      state.isAuthenticated = false
    },

    updateMustChangePassword: (state, action) => {
      if (!state.user) {
        return
      }

      state.user.mustChangePassword = action.payload

      localStorage.setItem(
        'invento_user',
        JSON.stringify(state.user),
      )
    },
  },
})

export const {
  setCredentials,
  updateCredentials,
  clearCredentials,
  updateMustChangePassword,
} = authSlice.actions

export default authSlice.reducer