import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, RefreshCw, Trophy } from 'lucide-react'
import { getProductos } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    setLoading(true)
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (error) {
      console.error('Error loading productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const categorias = [...new Set(productos.map(p => p.categoria?.nombre))]

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
              onClick={loadProductos} 
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
              <h1 className="text-5xl font-bold gradient-text">Catálogo de Productos</h1>
            </div>
            <p className="text-xl text-slate-300">Explora nuestro catálogo de productos deportivos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="card-hover bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Total Productos</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{productos.length}</div>
              <p className="text-xs text-slate-400 mt-1">Productos disponibles</p>
            </CardContent>
          </Card>
          <Card className="card-hover bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 border border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Categorías</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/20">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{categorias.length}</div>
              <p className="text-xs text-slate-400 mt-1">Categorías únicas</p>
            </CardContent>
          </Card>
          <Card className="card-hover bg-gradient-to-br from-teal-900/30 to-teal-800/30 border border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Stock Total</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{productos.reduce((sum, p) => sum + (p.stock || 0), 0)}</div>
              <p className="text-xs text-slate-400 mt-1">Unidades en inventario</p>
            </CardContent>
          </Card>
        </div>

        {/* Productos Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            <p className="text-slate-400 mt-4">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => (
              <Card key={producto.id} className="card-hover bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group">
                <div className="h-2 sport-gradient"></div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-medium"
                    >
                      {producto.categoria?.nombre}
                    </Badge>
                    <Badge 
                      variant={producto.stock > 10 ? 'success' : producto.stock > 0 ? 'warning' : 'destructive'}
                      className="font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    >
                      Stock: {producto.stock}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                    {producto.nombre}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-400">
                    {producto.descripcion}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold gradient-text">${producto.precio.toFixed(2)}</p>
                      <p className="text-sm text-slate-400">Precio unitario</p>
                    </div>
                    <Button 
                      onClick={() => navigate('/crear-pedido')}
                      className="sport-gradient hover:sport-gradient-dark text-white font-semibold group-hover:scale-105 transition-transform"
                    >
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
