'use client'

import { useState } from 'react'
import { Product } from '@/data/products'
import Image from 'next/image'
import { Edit, Trash2, Star, Search, PlusCircle, ArrowUpDown, AlertTriangle } from 'lucide-react'
import { hasPermission } from '@/data/permissions'

interface ToolsListProps {
  tools: Product[]
  onEdit: (tool: Product) => void
  onDelete: (toolName: string) => void
  onAdd: () => void
  userRole?: 'admin' | 'editor' | 'viewer'
}

export default function ToolsList({ tools, onEdit, onDelete, onAdd, userRole = 'admin' }: ToolsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<keyof Product>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const canCreateTool = hasPermission(userRole, 'create:tools')
  const canEditTool = hasPermission(userRole, 'edit:tools')
  const canDeleteTool = hasPermission(userRole, 'delete:tools')

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedTools = [...filteredTools].sort((a, b) => {
    const fieldA = a[sortField]
    const fieldB = b[sortField]
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA)
    }
    
    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA
    }
    
    if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') {
      return sortDirection === 'asc' 
        ? (fieldA === fieldB ? 0 : fieldA ? -1 : 1)
        : (fieldA === fieldB ? 0 : fieldA ? 1 : -1)
    }
    
    return 0
  })

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Araçlarda ara..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {canCreateTool ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Yeni Araç Ekle
          </button>
        ) : (
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">Yeni araç ekleme yetkiniz yok</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('name')}
                >
                  Araç
                  {sortField === 'name' && (
                    <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-primary dark:text-primary-light' : 'text-red-500 dark:text-red-400'}`} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('rating')}
                >
                  Puan
                  {sortField === 'rating' && (
                    <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-primary dark:text-primary-light' : 'text-red-500 dark:text-red-400'}`} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('featured')}
                >
                  Öne Çıkan
                  {sortField === 'featured' && (
                    <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-primary dark:text-primary-light' : 'text-red-500 dark:text-red-400'}`} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategoriler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTools.map((tool) => (
              <tr key={tool.name} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 relative">
                      <Image
                        src={tool.image}
                        fill
                        alt={tool.name}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{tool.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">{tool.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({tool.reviews})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tool.featured 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {tool.featured ? 'Evet' : 'Hayır'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {tool.categories.map((category) => (
                      <span key={category} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-3">
                    {canEditTool ? (
                      <button
                        onClick={() => onEdit(tool)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    ) : (
                      <button disabled className="text-gray-400 dark:text-gray-600 cursor-not-allowed">
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    
                    {canDeleteTool ? (
                      <button
                        onClick={() => onDelete(tool.name)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) : (
                      <button disabled className="text-gray-400 dark:text-gray-600 cursor-not-allowed">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedTools.length === 0 && (
          <div className="text-center py-8 bg-white dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">Araç bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  )
} 