'use client'

import { useState } from 'react'

interface AdminLoginProps {
  onLogin: (username: string, password: string) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Admin Girişi</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
            Şifre
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white py-2 rounded-lg transition-colors"
        >
          Giriş Yap
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        Demo için: Kullanıcı adı: admin, Şifre: admin123
      </p>
    </div>
  )
} 