import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Package, Users, LayoutDashboard, Globe, Menu, X, Info } from 'lucide-react'
import { useTranslation } from '@/i18n/LanguageContext'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const { t, language, changeLanguage } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showArchitecture, setShowArchitecture] = useState(false)

  const navItems = [
    { path: '/', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/pedidos', label: t('orders'), icon: ShoppingCart },
    { path: '/crear-pedido', label: t('createOrder'), icon: ShoppingCart, highlight: true },
    { path: '/productos', label: t('products'), icon: Package },
    { path: '/clientes', label: t('clients'), icon: Users },
  ]

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 group-hover:scale-105 transition-transform shadow-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">SportCore</span>
                <p className="text-xs text-gray-500">{t('sportManagement')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link key={item.path} to={item.path}>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : item.highlight
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Architecture Info Button */}
              <button
                onClick={() => setShowArchitecture(!showArchitecture)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                title="View Architecture Flow"
              >
                <Info className="h-4 w-4" />
                <span className="hidden md:inline">Architecture</span>
              </button>

              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
                  <Globe className="h-4 w-4" />
                  <span>{language === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}</span>
                </button>
                {/* Language Dropdown */}
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    <span>🇺🇸</span> English
                  </button>
                  <button
                    onClick={() => changeLanguage('es')}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    <span>🇪🇸</span> Español
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : item.highlight
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  setShowArchitecture(!showArchitecture)
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Info className="h-5 w-5" />
                Architecture
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Architecture Overlay */}
      {showArchitecture && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Architecture Flow</h2>
                <button
                  onClick={() => setShowArchitecture(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🌐 API Gateway (Nginx)</h3>
                <p className="text-sm text-blue-800">Routes all traffic through port 80 to appropriate microservices</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-900 mb-2">📦 Products Service (Flask)</h3>
                  <p className="text-sm text-emerald-800">Port 5001 - Manages product catalog and inventory</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">🛒 Orders Service (Flask)</h3>
                  <p className="text-sm text-purple-800">Port 5002 - Handles order processing and management</p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">👥 Clients Service (Django)</h3>
                  <p className="text-sm text-orange-800">Port 8000 - Manages client information and categories</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">⚡ Async Tasks (Celery + Redis)</h3>
                  <p className="text-sm text-red-800">Port 6379 - Handles background jobs and notifications</p>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🗄️ Database (PostgreSQL)</h3>
                <p className="text-sm text-gray-800">Port 5432 - Centralized data storage for all services</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🌍 Internationalization (i18n)</h3>
                <p className="text-sm text-gray-800">Full bilingual support (English/Spanish) using gettext and React Context</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
