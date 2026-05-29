import axios from 'axios'

// Use relative URL since frontend and backend are on same server
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

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

// Clientes
export const getClientes = async () => {
  const response = await api.get('/api/clientes/')
  return response.data
}

// Productos
export const getProductos = async () => {
  const response = await api.get('/api/productos/')
  return response.data
}

export default api
