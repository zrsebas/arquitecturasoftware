import { useState, useEffect } from 'react'
import { ArrowLeft, Package, User, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { getPedidos } from '@/services/api'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/LanguageContext'

export default function VerPedidos() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    setLoading(true)
    try {
      const data = await getPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/crear-pedido')}
                className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Volver</span>
              </button>
              <h1 className="text-xl font-bold">Pedidos</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Todos los Pedidos</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Cargando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay pedidos registrados</p>
                <button
                  onClick={() => navigate('/crear-pedido')}
                  className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Crear Primer Pedido
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {pedido.cliente?.nombre || 'Cliente desconocido'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(pedido.fecha).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {pedido.estado === 'completado' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm font-medium capitalize">{pedido.estado}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <DollarSign className="h-5 w-5" />
                          <span className="text-2xl font-bold">${pedido.total?.toFixed(2) || '0.00'}</span>
                        </div>
                        <p className="text-xs text-gray-500">{pedido.detallepedido_set?.length || 0} productos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
