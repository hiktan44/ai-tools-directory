'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, products as defaultProducts } from '@/data/products'
import { Star, Bookmark, ChevronRight, Search, ArrowRight, Zap, Sparkles, Code, GitBranch, Users, Send } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Hero section parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY
        heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`
        heroRef.current.style.opacity = `${1 - scrollY * 0.002}`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Admin panelden güncellenmiş araçları kontrol et
    const adminTools = localStorage.getItem('adminTools')
    if (adminTools) {
      try {
        setProducts(JSON.parse(adminTools))
      } catch (e) {
        console.error('Admin araçları yüklenirken hata oluştu:', e)
      }
    }

    // Animation for elements on page load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const filteredProducts = products.filter(product => {
    // Arama terimine göre filtrele
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Aktif kategoriye göre filtrele
    const matchesCategory = !activeCategory || product.categories.includes(activeCategory)
    
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.flatMap(p => p.categories)))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchRef.current) {
      setSearchTerm(searchRef.current.value)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewsletterSubmitted(true)
    setTimeout(() => setIsNewsletterSubmitted(false), 3000)
  }

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-900 text-white">
        <div 
          ref={heroRef} 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1677442135196-8ea1dd16d5ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-on-scroll opacity-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Geleceğin AI Araçlarını <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  Keşfedin ve Yönetin
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                İhtiyaçlarınıza uygun en iyi yapay zeka araçlarını bulun, karşılaştırın ve iş akışınıza entegre edin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#tools" 
                  className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-bold text-lg"
                >
                  Araçları Keşfet
                  <ChevronRight size={16} />
                </Link>
                <Link 
                  href="#developer" 
                  className="px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 font-bold text-lg"
                >
                  Geliştirici Olarak Katıl
                  <Code size={16} />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-on-scroll opacity-0">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <Image 
                  src="https://images.unsplash.com/photo-1676721215549-5e2f6f1d8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                  alt="AI Tools Hub"
                  width={500}
                  height={400}
                  className="relative z-10 rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white dark:text-gray-900 fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.86,82.7Z"></path>
          </svg>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-12 animate-on-scroll opacity-0">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchRef}
                type="text"
                placeholder="AI asistan, içerik üreticisi, veri analizi vb."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Ara
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-on-scroll opacity-0">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-primary dark:text-primary-light text-4xl font-bold mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-300">AI Araçları</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-primary dark:text-primary-light text-4xl font-bold mb-2">5K+</div>
            <div className="text-gray-600 dark:text-gray-300">Aktif Kullanıcı</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-primary dark:text-primary-light text-4xl font-bold mb-2">20+</div>
            <div className="text-gray-600 dark:text-gray-300">Kategoriler</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-primary dark:text-primary-light text-4xl font-bold mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-300">Değerlendirmeler</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 my-16">
        <div className="text-center mb-12 animate-on-scroll opacity-0">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">AI Araçları Dizini <span className="text-primary dark:text-primary-light">Avantajları</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Yapay zeka araçlarını keşfetmek, değerlendirmek ve iş akışınıza entegre etmek için özelleştirilmiş platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-on-scroll opacity-0">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <Zap className="text-primary dark:text-primary-light" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Hızlı Erişim</h3>
            <p className="text-gray-600 dark:text-gray-300">Gelişmiş filtreleme ve arama özellikleriyle ihtiyacınız olan yapay zeka aracını saniyeler içinde bulun.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-on-scroll opacity-0">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Akıllı Öneriler</h3>
            <p className="text-gray-600 dark:text-gray-300">İhtiyaçlarınıza göre özelleştirilmiş AI aracı önerileri ve alternatif çözümler.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-on-scroll opacity-0">
            <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <Users className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Topluluk Görüşleri</h3>
            <p className="text-gray-600 dark:text-gray-300">Gerçek kullanıcılardan gelen değerlendirmeler ve geri bildirimlerle en iyi araçları keşfedin.</p>
          </div>
        </div>
      </div>

      {/* Categories & Tools Section */}
      <div id="tools" className="container mx-auto px-4 my-16">
        <div className="text-center mb-8 animate-on-scroll opacity-0">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">AI Araçları <span className="text-primary dark:text-primary-light">Koleksiyonu</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            İhtiyaçlarınıza uygun en iyi yapay zeka araçlarını keşfedin ve işinizi bir üst seviyeye taşıyın
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto animate-on-scroll opacity-0">
          <div className="flex space-x-2 py-4 min-w-max">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null 
                  ? 'bg-primary dark:bg-primary-light text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tümü
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-primary dark:bg-primary-light text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Aramanıza uygun sonuç bulunamadı.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setActiveCategory(null)
                  if (searchRef.current) searchRef.current.value = ''
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Developer Section */}
      <div id="developer" className="container mx-auto px-4 my-24">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="animate-on-scroll opacity-0">
                <h2 className="text-3xl font-bold mb-4 text-white">Geliştirici misiniz?</h2>
                <p className="text-indigo-100 mb-6">
                  AI araçlarınızı dizinimize ekleyin ve binlerce potansiyel kullanıcıya ulaşın. Ekosistemimize katılmak için hemen başvurun.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:info@aitools.example.com" 
                    className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    İletişime Geç
                    <Send size={16} />
                  </a>
                  <a 
                    href="https://github.com/aitools" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    GitHub
                    <GitBranch size={16} />
                  </a>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 bg-white/10 backdrop-blur-sm">
              <div className="animate-on-scroll opacity-0">
                <h3 className="text-xl font-semibold mb-4 text-white">Geliştirici Avantajları</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-start gap-2">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Geniş kullanıcı kitlesine erişim imkanı</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Kullanıcı geri bildirimleri ile ürününüzü geliştirme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Ücretsiz tanıtım ve reklam olanağı</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span>Diğer geliştiricilerle işbirliği fırsatları</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 my-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 md:p-12 text-center animate-on-scroll opacity-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">AI Dünyasındaki Gelişmelerden Haberdar Olun</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            En yeni yapay zeka araçları, ipuçları ve sektör trendleri hakkında düzenli güncellemeler için bültenimize abone olun.
          </p>
          {isNewsletterSubmitted ? (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-4 rounded-lg inline-block">
              Teşekkürler! Bültenimize başarıyla abone oldunuz.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                required
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white rounded-lg font-medium transition-colors"
              >
                Abone Ol
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all hover:-translate-y-1 animate-on-scroll opacity-0">
      <div className="flex items-start gap-4">
        <div className="relative h-[60px] w-[60px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < product.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-300 dark:text-gray-500'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">({product.reviews})</span>
          </div>
        </div>
        <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <Bookmark className="w-4 h-4" />
          <span className="text-sm">{product.bookmarks}</span>
        </button>
      </div>
      
      <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 font-medium">{product.description}</p>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs text-primary dark:text-primary-light bg-blue-50 dark:bg-blue-900/30 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3 mt-4">
        <a 
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <button className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary rounded-lg transition-colors">
            Ziyaret Et
          </button>
        </a>
        <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
          İncele
        </button>
      </div>
    </div>
  )
}
