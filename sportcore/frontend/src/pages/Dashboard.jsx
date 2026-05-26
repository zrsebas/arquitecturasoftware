import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Users, Package, TrendingUp, ArrowRight, Trophy, Target, Zap, Activity } from 'lucide-react'
import { getPedidos } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      const data = await getPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Error loading pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total Pedidos',
      value: pedidos.length,
      icon: ShoppingCart,
      description: 'Pedidos registrados',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-900/30 to-emerald-800/30',
    },
    {
      title: 'Pedidos Confirmados',
      value: pedidos.filter(p => p.estado === 'CONFIRMADO').length,
      icon: Target,
      description: 'Pedidos completados',
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-900/30 to-cyan-800/30',
    },
    {
      title: 'Clientes Activos',
      value: new Set(pedidos.map(p => p.cliente?.id)).size,
      icon: Users,
      description: 'Clientes únicos',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-900/30 to-blue-800/30',
    },
    {
      title: 'Ingresos Totales',
      value: `$${pedidos.reduce((sum, p) => sum + (p.total || 0), 0).toFixed(2)}`,
      icon: Trophy,
      description: 'Total de ventas',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-900/30 to-teal-800/30',
    },
  ]

  const recentPedidos = pedidos.slice(0, 5)

  return (
    <div className="min-h-screen gradient-bg text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold gradient-text">SportCore</h1>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-2xl text-slate-300 max-w-2xl mx-auto mb-4">
            Sistema de Gestión Deportiva
          </p>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-slate-400">Rendimiento • Precisión • Victoria</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className={`card-hover bg-gradient-to-br ${stat.bgGradient} border border-white/10 backdrop-blur-sm`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-200">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg shadow-emerald-500/20`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="glass mb-12 border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Pedidos Recientes</CardTitle>
                <CardDescription className="text-slate-400">Los últimos 5 pedidos registrados</CardDescription>
              </div>
              <Button 
                onClick={() => navigate('/pedidos')}
                className="sport-gradient hover:sport-gradient-dark text-white font-semibold"
              >
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                <p className="text-slate-400 mt-4">Cargando pedidos...</p>
              </div>
            ) : recentPedidos.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 mb-4">No hay pedidos registrados</p>
                <Button 
                  onClick={() => navigate('/crear-pedido')}
                  className="sport-gradient hover:sport-gradient-dark text-white font-semibold"
                >
                  Crear Primer Pedido
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-white">Pedido #{pedido.id}</span>
                        <Badge 
                          variant={pedido.estado === 'CONFIRMADO' ? 'success' : 'secondary'}
                          className="font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        >
                          {pedido.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        {pedido.cliente?.nombre} • {new Date(pedido.fecha).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gradient-text">${pedido.total?.toFixed(2)}</p>
                      <p className="text-sm text-slate-400">
                        {pedido.detallepedido_set?.length || 0} items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="card-hover glass cursor-pointer group border border-white/10"
            onClick={() => navigate('/crear-pedido')}
          >
            <CardHeader>
              <div className="p-3 w-12 h-12 rounded-xl sport-gradient mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Nuevo Pedido</CardTitle>
              <CardDescription className="text-slate-400">Crear un nuevo pedido</CardDescription>
            </CardHeader>
          </Card>
          <Card 
            className="card-hover glass cursor-pointer group border border-white/10"
            onClick={() => navigate('/pedidos')}
          >
            <CardHeader>
              <div className="p-3 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <Package className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Ver Pedidos</CardTitle>
              <CardDescription className="text-slate-400">Gestionar pedidos existentes</CardDescription>
            </CardHeader>
          </Card>
          <Card 
            className="card-hover glass cursor-pointer group border border-white/10"
            onClick={() => navigate('/productos')}
          >
            <CardHeader>
              <div className="p-3 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/20">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Productos</CardTitle>
              <CardDescription className="text-slate-400">Ver catálogo de productos</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
