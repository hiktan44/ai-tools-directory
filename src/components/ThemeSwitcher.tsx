'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={theme === 'dark' ? 'Açık Tema\'ya Geç' : 'Koyu Tema\'ya Geç'}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-blue-600" />
      )}
    </button>
  )
} 