export const selectAuth = (state) => state.auth

export const selectAccessToken = (state) =>
  state.auth.accessToken

export const selectRefreshToken = (state) =>
  state.auth.refreshToken

export const selectCurrentUser = (state) =>
  state.auth.user

export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated

export const selectMustChangePassword = (state) =>
  Boolean(state.auth.user?.mustChangePassword)

export const selectHasPermission =
  (permission) => (state) =>
    Boolean(
      state.auth.user?.permissions?.includes(permission),
    )