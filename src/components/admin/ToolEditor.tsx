'use client'

import { useState } from 'react'
import { Product } from '@/data/products'
import Image from 'next/image'
import { X, Plus, AlertCircle } from 'lucide-react'

interface ToolEditorProps {
  tool: Product
  onSave: (tool: Product) => void
  onCancel: () => void
  isCreating: boolean
}

export default function ToolEditor({ tool, onSave, onCancel, isCreating }: ToolEditorProps) {
  const [formValues, setFormValues] = useState<Product>({ ...tool })
  const [tagInput, setTagInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageError, setImageError] = useState(false)

  const availableCategories = [
    'Featured',
    'Sales',
    'Back Office',
    'Operations',
    'Growth & Marketing',
    'Writing & Editing',
    'Technology & IT',
    'Design & Creative',
    'Workflow Automation'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: value
    })
    
    // Resim URL değiştiğinde hata durumunu sıfırla
    if (name === 'image') {
      setImageError(false)
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: parseFloat(value)
    })
  }

  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormValues({
      ...formValues,
      [name]: checked
    })
  }

  const addTag = () => {
    if (tagInput.trim() && !formValues.tags.includes(tagInput.trim())) {
      setFormValues({
        ...formValues,
        tags: [...formValues.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormValues({
      ...formValues,
      tags: formValues.tags.filter(t => t !== tag)
    })
  }

  const addCategory = () => {
    if (categoryInput && !formValues.categories.includes(categoryInput)) {
      setFormValues({
        ...formValues,
        categories: [...formValues.categories, categoryInput]
      })
      setCategoryInput('')
    }
  }

  const removeCategory = (category: string) => {
    setFormValues({
      ...formValues,
      categories: formValues.categories.filter(c => c !== category)
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formValues.name) newErrors.name = 'Araç adı gereklidir'
    if (!formValues.description) newErrors.description = 'Açıklama gereklidir'
    if (!formValues.image) newErrors.image = 'Resim URL gereklidir'
    if (!formValues.link) newErrors.link = 'Bağlantı gereklidir'
    if (formValues.categories.length === 0) newErrors.categories = 'En az bir kategori seçilmelidir'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formValues)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        {isCreating ? 'Yeni Araç Ekle' : 'Aracı Düzenle'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Araç Adı *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Açıklama *
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resim URL * <span className="text-xs text-gray-500 dark:text-gray-400">(Doğrudan resim URL&apos;si olmalı)</span>
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formValues.image}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.image || imageError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.image}</p>}
              {imageError && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> 
                  Geçerli bir resim URL&apos;si değil. Doğrudan resim bağlantısı giriniz (.jpg, .png, vb.)
                </p>
              )}
              
              {formValues.image && !imageError && (
                <div className="mt-2 relative h-16 w-16 overflow-hidden">
                  <Image
                    src={formValues.image}
                    fill
                    alt="Önizleme"
                    className="rounded-lg border border-gray-200 dark:border-gray-700 object-cover"
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bağlantı URL *
              </label>
              <input
                type="text"
                id="link"
                name="link"
                value={formValues.link}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.link ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="https://example.com"
              />
              {errors.link && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.link}</p>}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Puan (0-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formValues.rating}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex-1">
                <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Değerlendirme Sayısı
                </label>
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  min="0"
                  value={formValues.reviews}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex-1">
                <label htmlFor="bookmarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kaydetme Sayısı
                </label>
                <input
                  type="number"
                  id="bookmarks"
                  name="bookmarks"
                  min="0"
                  value={formValues.bookmarks}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formValues.featured}
                  onChange={handleCheckedChange}
                  className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Öne Çıkan
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Etiketler
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Etiket ekle"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary dark:bg-primary-light text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formValues.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-3 py-1"
                  >
                    <span className="text-sm font-medium">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formValues.tags.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic py-1">
                    Henüz etiket eklenmemiş
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategoriler *
              </label>
              <div className="flex space-x-2">
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className={`flex-grow px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.categories ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Kategori seçin...</option>
                  {availableCategories
                    .filter(cat => !formValues.categories.includes(cat))
                    .map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={addCategory}
                  className="px-4 py-2 bg-primary dark:bg-primary-light text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!categoryInput}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {errors.categories && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.categories}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {formValues.categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full px-3 py-1"
                  >
                    <span className="text-sm font-medium">{category}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-1.5 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formValues.categories.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic py-1">
                    Henüz kategori eklenmemiş
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8 space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary dark:bg-primary-light text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors"
          >
            {isCreating ? 'Oluştur' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
} 