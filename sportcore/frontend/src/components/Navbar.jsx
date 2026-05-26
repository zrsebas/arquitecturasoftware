import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ShoppingCart, Package, Users, Trophy, Activity } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
    { path: '/crear-pedido', label: 'Crear Pedido', icon: ShoppingCart },
    { path: '/productos', label: 'Productos', icon: Package },
    { path: '/clientes', label: 'Clientes', icon: Users },
  ]

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text">SportCore</span>
              <p className="text-xs text-slate-400">Gestión Deportiva</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`gap-2 font-medium ${
                      isActive 
                        ? 'sport-gradient hover:sport-gradient-dark text-white shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/10">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
