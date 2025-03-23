'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Local storage'dan tema ayarını al
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    // Eğer sistem tercihine göre ayarlı (system) ise veya değer yoksa
    // Karanlık mod tercihine bak
    if (!savedTheme) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(isDark ? 'dark' : 'light')
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } else {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Tema değiştiğinde HTML elementine class ekle/çıkar
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Local storage'a kaydet
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 