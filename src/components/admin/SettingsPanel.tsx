'use client'

import { useState, useEffect } from 'react'
import { Save, ShieldAlert } from 'lucide-react'
import { Role, hasPermission } from '@/data/permissions'

// Kullanıcı arayüzü
interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  itemsPerPage: number
  enableNotifications: boolean
  enableUserRegistration: boolean
  maintenanceMode: boolean
  footerText: string
  analyticsId: string
  theme: 'light' | 'dark' | 'system'
}

interface SettingsPanelProps {
  userRole?: Role
}

export default function SettingsPanel({ userRole = 'admin' }: SettingsPanelProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'AI Araçları Dizini',
    siteDescription: 'En iyi yapay zeka araçlarını keşfedin ve karşılaştırın',
    contactEmail: 'info@aitools.example.com',
    itemsPerPage: 10,
    enableNotifications: true,
    enableUserRegistration: true,
    maintenanceMode: false,
    footerText: '© 2023 AI Araçları Dizini. Tüm hakları saklıdır.',
    analyticsId: 'UA-XXXXXXXXX-1',
    theme: 'light'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // İzin kontrolleri
  const canViewSettings = hasPermission(userRole, 'view:settings')
  const canEditSettings = hasPermission(userRole, 'edit:settings')
  
  useEffect(() => {
    // LocalStorage'dan ayarları yükle
    const savedSettings = localStorage.getItem('siteSettings')
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Ayarlar yüklenirken hata oluştu:', e)
      }
    }
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canEditSettings) {
      alert('Ayarları düzenleme izniniz bulunmuyor!')
      return
    }
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    // Gerçek uygulamada burada API çağrısı yapılır
    // Simüle edilmiş kayıt işlemi
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // LocalStorage'a kaydet
    localStorage.setItem('siteSettings', JSON.stringify(settings))
    
    setIsSaving(false)
    setSaveSuccess(true)
    
    // Başarı mesajını 3 saniye sonra kaldır
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }
  
  if (!canViewSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Erişim Engellendi</h2>
        <p className="text-gray-800 dark:text-gray-200 max-w-md font-medium">
          Bu bölümü görüntülemek için gerekli izinlere sahip değilsiniz. Lütfen yönetici ile <span className="text-blue-600 dark:text-blue-400 font-bold">iletişime geçin</span>.
        </p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Site Ayarları</h2>
        {saveSuccess && (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
            Ayarlar başarıyla kaydedildi
          </div>
        )}
      </div>
      
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Ayarlar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                Site Adı
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                disabled={!canEditSettings}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                İletişim E-postası
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                disabled={!canEditSettings}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Site Açıklaması
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              disabled={!canEditSettings}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-1">
              Footer Metni
            </label>
            <input
              type="text"
              id="footerText"
              name="footerText"
              value={settings.footerText}
              onChange={handleInputChange}
              disabled={!canEditSettings}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Görünüm ve İşlevsellik</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa Başına Öğe Sayısı
              </label>
              <input
                type="number"
                id="itemsPerPage"
                name="itemsPerPage"
                value={settings.itemsPerPage}
                onChange={handleInputChange}
                disabled={!canEditSettings}
                min={5}
                max={50}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>
            
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Tema
              </label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleInputChange}
                disabled={!canEditSettings}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <option value="light">Açık</option>
                <option value="dark">Koyu</option>
                <option value="system">Sistem</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableNotifications"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleCheckboxChange}
                disabled={!canEditSettings}
                className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-blue-500'
                }`}
              />
              <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700">
                Bildirimleri Etkinleştir
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableUserRegistration"
                name="enableUserRegistration"
                checked={settings.enableUserRegistration}
                onChange={handleCheckboxChange}
                disabled={!canEditSettings}
                className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-blue-500'
                }`}
              />
              <label htmlFor="enableUserRegistration" className="ml-2 block text-sm text-gray-700">
                Kullanıcı Kaydını Etkinleştir
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleCheckboxChange}
                disabled={!canEditSettings}
                className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-blue-500'
                }`}
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                Bakım Modu
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Entegrasyonlar</h3>
          
          <div>
            <label htmlFor="analyticsId" className="block text-sm font-medium text-gray-700 mb-1">
              Google Analytics ID
            </label>
            <input
              type="text"
              id="analyticsId"
              name="analyticsId"
              value={settings.analyticsId}
              onChange={handleInputChange}
              disabled={!canEditSettings}
              placeholder="UA-XXXXXXXXX-X"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                !canEditSettings ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>
        
        {canEditSettings && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Kaydediliyor...' : (
                <>
                  <Save size={16} />
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
} 