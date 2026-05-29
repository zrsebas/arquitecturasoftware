import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Dashboard from '@/pages/Dashboard'
import VerPedidos from '@/pages/VerPedidos'
import CrearPedido from '@/pages/CrearPedido'
import Productos from '@/pages/Productos'
import Clientes from '@/pages/Clientes'
import { LanguageProvider } from '@/i18n/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pedidos" element={<VerPedidos />} />
            <Route path="/crear-pedido" element={<CrearPedido />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
