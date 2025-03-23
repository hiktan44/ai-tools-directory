'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/data/products'
import ToolsList from './ToolsList'
import ToolEditor from './ToolEditor'
import SettingsPanel from './SettingsPanel'
import UserManagement from './UserManagement'
import { Role, hasPermission } from '@/data/permissions'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tools, setTools] = useState<Product[]>([])
  const [currentTool, setCurrentTool] = useState<Product | null>(null)
  const [activeView, setActiveView] = useState<'tools' | 'users' | 'settings'>('tools')
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  // Kullanıcı rolünü localStorage'dan al, yoksa admin olarak başlat
  const [userRole, setUserRole] = useState<Role>('admin')

  useEffect(() => {
    // LocalStorage'dan verileri yükleme - ilk kullanımda orijinal verileri kullan
    const savedTools = localStorage.getItem('adminTools')
    
    if (savedTools) {
      setTools(JSON.parse(savedTools))
    } else {
      // Orijinal verileri dinamik olarak import et
      import('@/data/products').then((module) => {
        setTools(module.products)
        localStorage.setItem('adminTools', JSON.stringify(module.products))
      })
    }

    // Kullanıcı rolünü al
    const adminUserRole = localStorage.getItem('adminUserRole')
    if (adminUserRole) {
      setUserRole(adminUserRole as Role)
    }
  }, [])

  const saveTools = (updatedTools: Product[]) => {
    setTools(updatedTools)
    localStorage.setItem('adminTools', JSON.stringify(updatedTools))
  }

  const handleToolEdit = (tool: Product) => {
    if (!hasPermission(userRole, 'edit:tools')) {
      alert('Bu işlem için yetkiniz bulunmuyor!')
      return
    }
    setCurrentTool(tool)
    setIsEditing(true)
    setIsCreating(false)
  }

  const handleToolDelete = (toolName: string) => {
    if (!hasPermission(userRole, 'delete:tools')) {
      alert('Bu işlem için yetkiniz bulunmuyor!')
      return
    }
    if (confirm(`"${toolName}" aracını silmek istediğinizden emin misiniz?`)) {
      const updatedTools = tools.filter(tool => tool.name !== toolName)
      saveTools(updatedTools)
    }
  }

  const handleToolCreate = () => {
    if (!hasPermission(userRole, 'create:tools')) {
      alert('Bu işlem için yetkiniz bulunmuyor!')
      return
    }
    setCurrentTool({
      name: '',
      description: '',
      image: 'https://picsum.photos/seed/new/60',
      rating: 0,
      reviews: 0,
      bookmarks: 0,
      tags: [],
      categories: [],
      featured: false,
      link: ''
    })
    setIsCreating(true)
    setIsEditing(true)
  }

  const handleToolSave = (tool: Product) => {
    let updatedTools: Product[]
    
    if (isCreating) {
      updatedTools = [...tools, tool]
    } else {
      updatedTools = tools.map(t => t.name === currentTool?.name ? tool : t)
    }
    
    saveTools(updatedTools)
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
  }

  // Görünüm değiştirirken izin kontrolü yap
  const handleViewChange = (view: 'tools' | 'users' | 'settings') => {
    const permissionMap = {
      tools: 'view:tools',
      users: 'view:users',
      settings: 'view:settings'
    } as const;
    
    if (!hasPermission(userRole, permissionMap[view])) {
      alert('Bu bölümü görüntüleme yetkiniz bulunmuyor!')
      return
    }
    
    setActiveView(view)
  }

  // Rol değiştirme (test için)
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role
    setUserRole(newRole)
    localStorage.setItem('adminUserRole', newRole)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Paneli</h1>
        <div className="flex items-center gap-4">
          {/* Test amaçlı rol değiştirici */}
          <div className="flex items-center gap-2">
            <label htmlFor="role-select" className="font-medium text-gray-700 dark:text-gray-300">
              Test Rolü:
            </label>
            <select
              id="role-select"
              value={userRole}
              onChange={handleRoleChange}
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editör</option>
              <option value="viewer">İzleyici</option>
            </select>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            className={`px-6 py-4 font-medium ${
              activeView === 'tools' 
                ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-light border-b-2 border-primary dark:border-primary-light' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewChange('tools')}
          >
            Araçlar
          </button>
          <button 
            className={`px-6 py-4 font-medium ${
              activeView === 'users' 
                ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-light border-b-2 border-primary dark:border-primary-light' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewChange('users')}
          >
            Kullanıcılar
          </button>
          <button 
            className={`px-6 py-4 font-medium ${
              activeView === 'settings' 
                ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-light border-b-2 border-primary dark:border-primary-light' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewChange('settings')}
          >
            Ayarlar
          </button>
        </div>

        <div className="p-6">
          {activeView === 'tools' && (
            <>
              {isEditing ? (
                <ToolEditor 
                  tool={currentTool!} 
                  onSave={handleToolSave} 
                  onCancel={handleCancel} 
                  isCreating={isCreating}
                />
              ) : (
                <ToolsList 
                  tools={tools} 
                  onEdit={handleToolEdit} 
                  onDelete={handleToolDelete} 
                  onAdd={handleToolCreate}
                  userRole={userRole}
                />
              )}
            </>
          )}

          {activeView === 'users' && (
            <UserManagement userRole={userRole} />
          )}

          {activeView === 'settings' && (
            <SettingsPanel userRole={userRole} />
          )}
        </div>
      </div>
    </div>
  )
} 