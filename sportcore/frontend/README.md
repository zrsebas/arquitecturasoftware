# SportCore Frontend

Frontend moderno para el sistema de gestión de pedidos deportivos SportCore.

## 🚀 Tecnologías

- **React 18** - Biblioteca JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida y moderna
- **TailwindCSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento para aplicaciones React
- **Lucide React** - Iconos modernos y consistentes
- **Axios** - Cliente HTTP para hacer peticiones a la API

## 📋 Características

- **Dashboard** - Vista general con estadísticas y pedidos recientes
- **Gestión de Pedidos** - Lista completa de pedidos con detalles
- **Crear Pedidos** - Formulario intuitivo para crear nuevos pedidos
- **Catálogo de Productos** - Visualización de productos con stock y precios
- **Gestión de Clientes** - Lista de clientes registrados
- **Diseño Responsivo** - Adaptado para móviles y escritorio
- **UI Moderna** - Componentes estilo shadcn/ui

## 🛠️ Instalación

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```
VITE_API_URL=http://127.0.0.1:8000
```

### Proxy de Desarrollo

El proyecto está configurado con un proxy en `vite.config.js` para redirigir las peticiones a la API de Django:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  },
}
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes UI base (Button, Card, etc.)
│   │   └── Navbar.jsx   # Barra de navegación
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Dashboard.jsx
│   │   ├── Pedidos.jsx
│   │   ├── CrearPedido.jsx
│   │   ├── Productos.jsx
│   │   └── Clientes.jsx
│   ├── services/        # Servicios y API
│   │   └── api.js       # Cliente Axios
│   ├── utils/           # Utilidades
│   │   └── utils.js     # Funciones helper
│   ├── App.jsx          # Componente principal con routing
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales y Tailwind
├── public/              # Archivos estáticos
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── postcss.config.js    # Configuración de PostCSS
```

## 🎨 Componentes UI

El proyecto utiliza componentes UI personalizados inspirados en shadcn/ui:

- **Button** - Botones con múltiples variantes
- **Card** - Tarjetas para contenido agrupado
- **Input** - Campos de entrada de texto
- **Badge** - Etiquetas y badges

## 🔌 Integración con la API

El frontend se conecta a la API de Django REST Framework a través del servicio `api.js`:

```javascript
import { getPedidos, createPedido } from '@/services/api'

// Obtener pedidos
const pedidos = await getPedidos()

// Crear pedido
const nuevoPedido = await createPedido({
  cliente_id: 1,
  items: [{ producto_id: 1, cantidad: 2 }]
})
```

## 🚀 Despliegue

### Construcción para Producción

```bash
npm run build
```

Esto generará una carpeta `dist/` con los archivos optimizados para producción.

### Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Desplegar automáticamente

### Despliegue en Netlify

1. Conectar el repositorio a Netlify
2. Configurar el comando de build: `npm run build`
3. Configurar el directorio de publicación: `dist`
4. Desplegar

### Integración con Django

Para servir el frontend desde Django:

1. Construir el frontend: `npm run build`
2. Copiar la carpeta `dist/` a la carpeta `static/` de Django
3. Configurar Django para servir el archivo `index.html`
4. Actualizar las URLs de Django para manejar el routing del cliente

## 📝 Notas

- El frontend está configurado para funcionar con el backend de Django en `http://127.0.0.1:8000`
- Asegúrate de que el backend de Django esté corriendo antes de iniciar el frontend
- CORS está configurado en Django para permitir peticiones desde `http://localhost:5173`

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch
3. Commit changes
4. Push to branch
5. Pull Request

## 📄 Licencia

MIT License
