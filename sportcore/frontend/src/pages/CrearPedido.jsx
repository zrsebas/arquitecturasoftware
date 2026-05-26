import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Trash2, ShoppingCart, Trophy } from 'lucide-react'
import { createPedido, getClientes, getProductos } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function CrearPedido() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [items, setItems] = useState([])
  const [selectedProducto, setSelectedProducto] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
      setItems([...items, { producto_id: parseInt(selectedProducto), cantidad }])
    }

    setSelectedProducto('')
    setCantidad(1)
  }

  const eliminarItem = (productoId) => {
    setItems(items.filter(item => item.producto_id !== productoId))
  }

  const calcularTotal = () => {
    return items.reduce((sum, item) => {
      const producto = productos.find(p => p.id === item.producto_id)
      return sum + (producto?.precio || 0) * item.cantidad
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedCliente || items.length === 0) {
      alert('Por favor selecciona un cliente y agrega al menos un producto')
      return
    }

    setSubmitting(true)
    try {
      await createPedido({
        cliente_id: parseInt(selectedCliente),
        items: items,
      })
      alert('Pedido creado exitosamente')
      navigate('/pedidos')
    } catch (error) {
      console.error('Error creating pedido:', error)
      alert('Error al crear el pedido. Por favor intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mb-4"></div>
          <p className="text-slate-400">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6 text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold gradient-text">Crear Nuevo Pedido</h1>
            </div>
            <p className="text-xl text-slate-300">Completa el formulario para crear un nuevo pedido</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-8">
              {/* Selección de Cliente */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Seleccionar Cliente</CardTitle>
                  <CardDescription className="text-slate-400">Elige el cliente para este pedido</CardDescription>
                </CardHeader>
                <CardContent>
                  <select
                    value={selectedCliente}
                    onChange={(e) => setSelectedCliente(e.target.value)}
                    className="w-full h-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} - {cliente.correo}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Agregar Productos */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Agregar Productos</CardTitle>
                  <CardDescription className="text-slate-400">Selecciona los productos para el pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-slate-200">Producto</label>
                      <select
                        value={selectedProducto}
                        onChange={(e) => setSelectedProducto(e.target.value)}
                        className="w-full h-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Seleccionar producto...</option>
                        {productos.map((producto) => (
                          <option key={producto.id} value={producto.id}>
                            {producto.nombre} - ${producto.precio.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-slate-200">Cantidad</label>
                      <Input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                        className="w-full h-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={agregarItem}
                    disabled={!selectedProducto}
                    className="w-full h-12 sport-gradient hover:sport-gradient-dark text-lg font-semibold"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Agregar al Pedido
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Items */}
              {items.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Items del Pedido</CardTitle>
                    <CardDescription className="text-slate-400">{items.length} productos seleccionados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => {
                        const producto = productos.find(p => p.id === item.producto_id)
                        return (
                          <div
                            key={item.producto_id}
                            className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-lg text-white">{producto?.nombre}</p>
                              <p className="text-sm text-slate-400">
                                ${producto?.precio?.toFixed(2)} x {item.cantidad}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge 
                                variant="secondary" 
                                className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-semibold px-4 py-2 text-lg"
                              >
                                ${(producto?.precio * item.cantidad).toFixed(2)}
                              </Badge>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => eliminarItem(item.producto_id)}
                                className="hover:scale-110 transition-transform"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="h-2 sport-gradient"></div>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Resumen del Pedido</CardTitle>
                  <CardDescription className="text-slate-400">Revisa los detalles antes de enviar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Cliente:</span>
                      <span className="font-semibold text-white">
                        {clientes.find(c => c.id === parseInt(selectedCliente))?.nombre || 'No seleccionado'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Items:</span>
                      <span className="font-semibold text-white">{items.length}</span>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-white">Total:</span>
                        <span className="text-4xl font-bold gradient-text">
                          ${calcularTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 sport-gradient hover:sport-gradient-dark text-lg font-semibold"
                    size="lg"
                    disabled={!selectedCliente || items.length === 0 || submitting}
                  >
                    {submitting ? 'Procesando...' : 'Crear Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
