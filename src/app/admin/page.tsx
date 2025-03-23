'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminLogin from '@/components/admin/AdminLogin'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // Gerçek uygulamada JWT veya oturum kontrolü yapılmalı
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (username: string, password: string) => {
    // Bu basit bir demo - gerçek uygulamada sunucu tarafında doğrulama yapılmalıdır
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true')
      setIsLoggedIn(true)
    } else {
      alert('Yanlış kullanıcı adı veya şifre!')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    setIsLoggedIn(false)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link href="/" className="text-primary dark:text-primary-light hover:underline">
          ← Ana Sayfaya Dön
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
        {isLoggedIn ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </div>
    </div>
  )
} 