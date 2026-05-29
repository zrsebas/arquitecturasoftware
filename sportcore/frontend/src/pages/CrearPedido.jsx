import { useState, useEffect } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Check, Package, User, Info, ChevronRight, Layers, Database, Zap, Server, LayoutDashboard, X } from 'lucide-react'
import { createPedido, getClientes, getProductos } from '@/services/api'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/LanguageContext'

export default function CrearPedido() {
  const { t, language } = useTranslation()
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [clienteSearch, setClienteSearch] = useState('')
  const [items, setItems] = useState([])
  const [selectedProducto, setSelectedProducto] = useState('')
  const [productoSearch, setProductoSearch] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showArchitecture, setShowArchitecture] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [clientesData, productosData] = await Promise.all([
        getClientes(),
        getProductos(),
      ])
      setClientes(clientesData)
      setProductos(productosData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const agregarItem = () => {
    if (!selectedProducto || cantidad < 1) return

    const producto = productos.find(p => p.id === parseInt(selectedProducto))
    if (!producto) return

    const existingItem = items.find(item => item.producto_id === parseInt(selectedProducto))
    if (existingItem) {
      setItems(items.map(item =>
        item.producto_id === parseInt(selectedProducto)
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ))
    } else {
      setItems([...items, { producto_id: parseInt(selectedProducto), cantidad, producto }])
    }

    setSelectedProducto('')
    setCantidad(1)
    setProductoSearch('')
  }

  const eliminarItem = (productoId) => {
    setItems(items.filter(item => item.producto_id !== productoId))
  }

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return
    setItems(items.map(item =>
      item.producto_id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ))
  }

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const producto = productos.find(p => p.id === item.producto_id)
      return total + (producto ? producto.precio * item.cantidad : 0)
    }, 0)
  }

  const handleSubmit = async () => {
    if (!selectedCliente || items.length === 0) {
      alert('Please select a client and add at least one product')
      return
    }

    setSubmitting(true)
    try {
      const clienteId = parseInt(selectedCliente)
      console.log('DEBUG: selectedCliente:', selectedCliente)
      console.log('DEBUG: clienteId:', clienteId)
      console.log('DEBUG: items:', items)
      
      await createPedido({
        cliente_id: clienteId,
        items: items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad
        }))
      })
      navigate('/pedidos')
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Error creating order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    c.correo.toLowerCase().includes(clienteSearch.toLowerCase())
  )

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(productoSearch.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(productoSearch.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingData')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-lg font-bold">SportCore</span>
                  <span className="text-gray-400 text-sm ml-2">| Sports Management</span>
                </div>
              </div>
              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <a href="/" className="hover:text-white transition-colors">Dashboard</a>
                <ChevronRight className="h-4 w-4" />
                <a href="/pedidos" className="hover:text-white transition-colors">Orders</a>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">Create Order</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowArchitecture(!showArchitecture)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Architecture Flow</span>
              </button>
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                  <span>🌐</span>
                  <span>{language === 'en' ? 'EN' : 'ES'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  A
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Architecture Overlay */}
      {showArchitecture && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Architecture Flow Visualization</h2>
                <button
                  onClick={() => setShowArchitecture(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-3">
                  <Server className="h-8 w-8 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-900">Nginx API Gateway</h3>
                </div>
                <p className="text-blue-800">Routes all HTTP traffic through port 80 to appropriate microservices based on URL patterns</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <LayoutDashboard className="h-8 w-8 text-orange-600" />
                    <h3 className="text-xl font-bold text-orange-900">Django Monolito</h3>
                  </div>
                  <p className="text-orange-800">Manages clients, categories, and serves the React frontend (Port 8000)</p>
                </div>
                
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Package className="h-8 w-8 text-emerald-600" />
                    <h3 className="text-xl font-bold text-emerald-900">Flask MS - Products</h3>
                  </div>
                  <p className="text-emerald-800">Handles product catalog and inventory management (Port 5001)</p>
                </div>
                
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <ShoppingCart className="h-8 w-8 text-purple-600" />
                    <h3 className="text-xl font-bold text-purple-900">Flask MS - Orders</h3>
                  </div>
                  <p className="text-purple-800">Processes order creation and management (Port 5002)</p>
                </div>
                
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Zap className="h-8 w-8 text-red-600" />
                    <h3 className="text-xl font-bold text-red-900">Celery + Redis</h3>
                  </div>
                  <p className="text-red-800">Background tasks: emails, reports, notifications (Port 6379)</p>
                </div>
              </div>
              
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-3">
                  <Database className="h-8 w-8 text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-900">PostgreSQL Database</h3>
                </div>
                <p className="text-gray-800">Centralized data storage for all services (Port 5432)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/pedidos')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Orders</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new order</p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Select Client</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={clienteSearch}
                    onChange={(e) => setClienteSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredClientes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No clients found</p>
                    </div>
                  ) : (
                    filteredClientes.map(cliente => (
                      <button
                        key={cliente.id}
                        onClick={() => setSelectedCliente(cliente.id.toString())}
                        className={`w-full text-left px-4 py-4 rounded-lg border transition-all flex items-center gap-4 ${
                          selectedCliente === cliente.id.toString()
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {cliente.nombre.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{cliente.nombre}</p>
                          <p className="text-sm text-gray-500">{cliente.correo}</p>
                        </div>
                        {selectedCliente === cliente.id.toString() && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Product Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Select Products</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productoSearch}
                    onChange={(e) => setProductoSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredProductos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No products found</p>
                    </div>
                  ) : (
                    filteredProductos.map(producto => (
                      <div
                        key={producto.id}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedProducto === producto.id.toString()
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                            <Package className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{producto.nombre}</p>
                            <p className="text-sm text-gray-500">{producto.descripcion}</p>
                            <p className="text-xs text-gray-400 mt-1">Category: {producto.categoria?.nombre || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-emerald-600">${producto.precio}</p>
                            <p className="text-xs text-gray-500">Stock: {producto.stock}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={producto.stock}
                              value={selectedProducto === producto.id.toString() ? cantidad : 1}
                              onChange={(e) => {
                                if (selectedProducto === producto.id.toString()) {
                                  setCantidad(parseInt(e.target.value) || 1)
                                }
                              }}
                              disabled={selectedProducto !== producto.id.toString()}
                              className="w-16 px-2 py-2 text-center border-0 focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                              onClick={() => setCantidad(prev => prev + 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProducto(producto.id.toString())
                              setCantidad(1)
                            }}
                            className="flex-1 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                          >
                            {selectedProducto === producto.id.toString() ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={agregarItem}
                  disabled={!selectedProducto || cantidad < 1}
                  className="w-full mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                  Add to Order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Order Summary</h2>
                </div>
              </div>
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No items in order</p>
                    <p className="text-sm">Add products to continue</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                      {items.map((item) => {
                        const producto = productos.find(p => p.id === item.producto_id)
                        if (!producto) return null
                        return (
                          <div key={item.producto_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                              <Package className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{producto.nombre}</p>
                              <p className="text-xs text-gray-500">${producto.precio} each</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
                              <button
                                onClick={() => {
                                  const currentItem = items.find(i => i.producto_id === item.producto_id)
                                  if (currentItem) actualizarCantidad(item.producto_id, currentItem.cantidad - 1)
                                }}
                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-semibold text-sm">x{item.cantidad}</span>
                              <button
                                onClick={() => {
                                  const currentItem = items.find(i => i.producto_id === item.producto_id)
                                  if (currentItem) actualizarCantidad(item.producto_id, currentItem.cantidad + 1)
                                }}
                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-sm">${(producto.precio * item.cantidad).toFixed(2)}</p>
                            </div>
                            <button
                              onClick={() => eliminarItem(item.producto_id)}
                              className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">${calcularTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-gray-900">$0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-purple-600">${calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedCliente || items.length === 0 || submitting}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          Confirm Order
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
