export const APP_NAME = 'Invento'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7075/api/v1'

export const THEMES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})