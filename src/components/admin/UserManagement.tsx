'use client'

import { useState, useEffect } from 'react'
import { UserPlus, Trash2, PenSquare, Search, Filter, ChevronDown, ShieldAlert } from 'lucide-react'
import { Role, hasPermission } from '@/data/permissions'

// Kullanıcı arayüzü
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  lastLogin: string
  createdAt: string
}

interface UserManagementProps {
  userRole?: Role
}

export default function UserManagement({ userRole = 'admin' }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // İzin kontrolleri
  const canCreateUser = hasPermission(userRole, 'create:users')
  const canEditUser = hasPermission(userRole, 'edit:users')
  const canDeleteUser = hasPermission(userRole, 'delete:users')
  
  useEffect(() => {
    // LocalStorage'dan kullanıcıları yükle
    const savedUsers = localStorage.getItem('adminUsers')
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
      setFilteredUsers(JSON.parse(savedUsers))
    } else {
      // Demo kullanıcıları yükle
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'Admin Kullanıcı',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2023-03-20T14:25:00Z',
          createdAt: '2023-01-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Editör Kullanıcı',
          email: 'editor@example.com',
          role: 'editor',
          status: 'active',
          lastLogin: '2023-03-18T09:15:00Z',
          createdAt: '2023-01-15T14:30:00Z'
        },
        {
          id: '3',
          name: 'İzleyici Kullanıcı',
          email: 'viewer@example.com',
          role: 'viewer',
          status: 'inactive',
          lastLogin: '2023-02-28T16:45:00Z',
          createdAt: '2023-02-01T11:20:00Z'
        }
      ]
      
      setUsers(demoUsers)
      setFilteredUsers(demoUsers)
      localStorage.setItem('adminUsers', JSON.stringify(demoUsers))
    }
  }, [])
  
  useEffect(() => {
    // Filtreleme ve arama işlemini uygula
    let result = [...users]
    
    // Arama terimini uygula
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Rol filtresini uygula
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter)
    }
    
    // Durum filtresini uygula
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter)
    }
    
    setFilteredUsers(result)
  }, [users, searchTerm, roleFilter, statusFilter])
  
  const handleAddUser = () => {
    if (!canCreateUser) {
      alert('Kullanıcı ekleme izniniz bulunmuyor!')
      return
    }
    
    setCurrentUser({
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'viewer',
      status: 'active',
      lastLogin: '-',
      createdAt: new Date().toISOString()
    })
    setIsAddingUser(true)
    setIsEditingUser(false)
  }
  
  const handleEditUser = (user: User) => {
    if (!canEditUser) {
      alert('Kullanıcı düzenleme izniniz bulunmuyor!')
      return
    }
    
    setCurrentUser(user)
    setIsEditingUser(true)
    setIsAddingUser(false)
  }
  
  const handleDeleteUser = (userId: string) => {
    if (!canDeleteUser) {
      alert('Kullanıcı silme izniniz bulunmuyor!')
      return
    }
    
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))
    }
  }
  
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) return
    
    let updatedUsers: User[]
    
    if (isAddingUser) {
      updatedUsers = [...users, currentUser]
    } else {
      updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u)
    }
    
    setUsers(updatedUsers)
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))
    
    setIsAddingUser(false)
    setIsEditingUser(false)
    setCurrentUser(null)
  }
  
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentUser) return
    
    setCurrentUser({
      ...currentUser,
      [e.target.name]: e.target.value
    })
  }
  
  const formatDate = (dateString: string) => {
    if (dateString === '-') return '-'
    
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (_) {
      return dateString
    }
  }
  
  if (isAddingUser || isEditingUser) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">
          {isAddingUser ? 'Yeni Kullanıcı Ekle' : 'Kullanıcıyı Düzenle'}
        </h2>
        
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                value={currentUser?.name || ''}
                onChange={handleUserInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta Adresi
              </label>
              <input
                type="email"
                name="email"
                value={currentUser?.email || ''}
                onChange={handleUserInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                name="role"
                value={currentUser?.role || 'viewer'}
                onChange={handleUserInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editör</option>
                <option value="viewer">İzleyici</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                name="status"
                value={currentUser?.status || 'active'}
                onChange={handleUserInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsAddingUser(false)
                setIsEditingUser(false)
                setCurrentUser(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    )
  }
  
  if (!hasPermission(userRole, 'view:users')) {
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
        <h2 className="text-xl font-semibold">Kullanıcı Yönetimi</h2>
        {canCreateUser ? (
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UserPlus size={16} />
            <span>Yeni Kullanıcı</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-yellow-600">
            <ShieldAlert size={16} />
            <span className="text-sm">Yeni kullanıcı ekleme yetkiniz yok</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="editor">Editör</option>
              <option value="viewer">İzleyici</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Giriş
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kayıt Tarihi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'editor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' 
                        ? 'Admin' 
                        : user.role === 'editor' 
                        ? 'Editör' 
                        : 'İzleyici'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {canEditUser ? (
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PenSquare size={16} />
                        </button>
                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <PenSquare size={16} />
                        </button>
                      )}
                      
                      {canDeleteUser ? (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Kullanıcı bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 