import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react'
import { getPedidos } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    setLoading(true)
    try {
      const data = await getPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Error loading pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (estado) => {
    switch (estado) {
      case 'CONFIRMADO':
        return 'success'
      case 'CREADO':
        return 'secondary'
      default:
        return 'warning'
    }
  }

  return (
    <div className="min-h-screen gradient-bg text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <Button 
              onClick={loadPedidos} 
              disabled={loading}
              className="sport-gradient hover:sport-gradient-dark text-white font-semibold"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold gradient-text">Pedidos</h1>
            </div>
            <p className="text-xl text-slate-300">Gestión de todos los pedidos</p>
          </div>
        </div>

        {/* Pedidos List */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Todos los Pedidos</CardTitle>
            <CardDescription className="text-slate-400">{pedidos.length} pedidos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
                <p className="text-slate-400 mt-4">Cargando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 mb-4">No hay pedidos registrados</p>
                <Button 
                  onClick={() => navigate('/crear-pedido')}
                  className="sport-gradient hover:sport-gradient-dark text-white font-semibold"
                >
                  Crear Primer Pedido
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white">Pedido #{pedido.id}</h3>
                          <Badge 
                            variant={getStatusVariant(pedido.estado)}
                            className="font-medium px-3 py-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          >
                            {pedido.estado}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-slate-400">
                          <p><span className="font-semibold">Cliente:</span> {pedido.cliente?.nombre}</p>
                          <p><span className="font-semibold">Email:</span> {pedido.cliente?.correo}</p>
                          <p><span className="font-semibold">Dirección:</span> {pedido.cliente?.direccion}</p>
                          <p><span className="font-semibold">Fecha:</span> {new Date(pedido.fecha).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-3xl font-bold gradient-text">${pedido.total?.toFixed(2)}</p>
                        <p className="text-sm text-slate-400">
                          {pedido.detallepedido_set?.length || 0} items
                        </p>
                      </div>
                    </div>
                    
                    {pedido.detallepedido_set && pedido.detallepedido_set.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="font-semibold mb-4 text-white">Items del Pedido:</h4>
                        <div className="space-y-3">
                          {pedido.detallepedido_set.map((detalle, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-white">{detalle.producto?.nombre}</p>
                                <p className="text-sm text-slate-400">
                                  {detalle.producto?.categoria?.nombre}
                                </p>
                              </div>
                              <div className="text-right ml-6">
                                <p className="font-semibold text-white">x{detalle.cantidad}</p>
                                <p className="text-sm text-slate-400">
                                  ${detalle.precio_unitario?.toFixed(2)} c/u
                                </p>
                              </div>
                              <div className="ml-6 text-xl font-bold gradient-text">
                                ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
