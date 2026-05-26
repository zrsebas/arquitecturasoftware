import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, RefreshCw, Mail, MapPin, Trophy } from 'lucide-react'
import { getClientes } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    setLoading(true)
    try {
      const data = await getClientes()
      setClientes(data)
    } catch (error) {
      console.error('Error loading clientes:', error)
    } finally {
      setLoading(false)
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
              onClick={loadClientes} 
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
              <h1 className="text-5xl font-bold gradient-text">Clientes</h1>
            </div>
            <p className="text-xl text-slate-300">Gestión de clientes registrados</p>
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold gradient-text">{clientes.length}</div>
            <p className="text-slate-400 mt-2">Clientes registrados en el sistema</p>
          </CardContent>
        </Card>

        {/* Clientes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            <p className="text-slate-400 mt-4">Cargando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-400 mb-4 text-lg">No hay clientes registrados</p>
              <p className="text-sm text-slate-500">
                Los clientes se pueden gestionar desde el panel de administración de Django
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientes.map((cliente) => (
              <Card key={cliente.id} className="card-hover bg-white/5 backdrop-blur-sm border border-white/10 group">
                <div className="h-2 sport-gradient"></div>
                <CardHeader>
                  <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                    {cliente.nombre}
                  </CardTitle>
                  <CardDescription className="text-slate-400">Cliente #{cliente.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Mail className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">{cliente.correo}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-cyan-500/20 mt-0.5">
                      <MapPin className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-300">{cliente.direccion}</span>
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
