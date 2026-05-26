import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Dashboard from '@/pages/Dashboard'
import Pedidos from '@/pages/Pedidos'
import CrearPedido from '@/pages/CrearPedido'
import Productos from '@/pages/Productos'
import Clientes from '@/pages/Clientes'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/crear-pedido" element={<CrearPedido />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
