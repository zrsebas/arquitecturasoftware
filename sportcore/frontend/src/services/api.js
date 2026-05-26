import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Pedidos
export const getPedidos = async () => {
  const response = await api.get('/api/pedidos/')
  return response.data
}

export const getPedido = async (id) => {
  const response = await api.get(`/api/pedidos/${id}/`)
  return response.data
}

export const createPedido = async (data) => {
  const response = await api.post('/api/pedidos/', data)
  return response.data
}

// Clientes (simulado - necesitaría endpoints en Django)
export const getClientes = async () => {
  // Por ahora, retornamos datos mockeados ya que no hay endpoint
  return [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@email.com', direccion: 'Calle 123 #45' },
    { id: 2, nombre: 'María García', correo: 'maria@email.com', direccion: 'Avenida 67 #89' },
    { id: 3, nombre: 'Carlos López', correo: 'carlos@email.com', direccion: 'Carrera 45 #12' },
  ]
}

// Productos (simulado - necesitaría endpoints en Django)
export const getProductos = async () => {
  // Por ahora, retornamos datos mockeados ya que no hay endpoint
  return [
    { 
      id: 1, 
      nombre: 'Balón Profesional', 
      precio: 29.99, 
      descripcion: 'Balón de alta calidad profesional', 
      categoria: { id: 1, nombre: 'Fútbol' },
      stock: 50
    },
    { 
      id: 2, 
      nombre: 'Camiseta Deportiva', 
      precio: 49.99, 
      descripcion: 'Camiseta transpirable para deporte', 
      categoria: { id: 2, nombre: 'Ropa' },
      stock: 30
    },
    { 
      id: 3, 
      nombre: 'Zapatillas Running', 
      precio: 89.99, 
      descripcion: 'Zapatillas ligeras para correr', 
      categoria: { id: 3, nombre: 'Calzado' },
      stock: 20
    },
    { 
      id: 4, 
      nombre: 'Guantes de Boxeo', 
      precio: 39.99, 
      descripcion: 'Guantes profesionales de boxeo', 
      categoria: { id: 4, nombre: 'Boxeo' },
      stock: 15
    },
    { 
      id: 5, 
      nombre: 'Mancuernas 5kg', 
      precio: 24.99, 
      descripcion: 'Par de mancuernas de 5kg', 
      categoria: { id: 5, nombre: 'Fitness' },
      stock: 25
    },
  ]
}

export default api
