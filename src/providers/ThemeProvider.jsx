import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { THEMES } from '@/constants/app'

const ThemeContext = createContext(null)

function getInitialTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME)

  if (storedTheme === THEMES.DARK || storedTheme === THEMES.LIGHT) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove(THEMES.LIGHT, THEMES.DARK)
    root.classList.add(theme)

    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => {
        setTheme((currentTheme) =>
          currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK,
        )
      },
      isDark: theme === THEMES.DARK,
    }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}