# Instrucciones para Ejecutar el Frontend de SportCore

## ⚠️ Requisito Importante

Para ejecutar el frontend, necesitas tener **Node.js** instalado en tu sistema.

### Instalar Node.js

1. Descargar Node.js desde: https://nodejs.org/
2. Instalar la versión LTS recomendada (v18.x o superior)
3. Verificar la instalación:
   ```bash
   node --version
   npm --version
   ```

## 🚀 Pasos para Ejecutar el Frontend

### 1. Instalar Dependencias

Navegar al directorio del frontend e instalar las dependencias:

```bash
cd frontend
npm install
```

Esto instalará todas las dependencias necesarias:
- React 18
- Vite
- TailwindCSS
- React Router
- Lucide React (iconos)
- Axios (cliente HTTP)
- Y más...

### 2. Configurar Variables de Entorno

Crear el archivo `.env`:

```bash
cp .env.example .env
```

O crearlo manualmente con el contenido:

```
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

### 4. Asegurarse que el Backend esté Corriendo

En otra terminal, iniciar el backend de Django:

```bash
# Desde la raíz del proyecto
venv\Scripts\activate
python manage.py runserver
```

El backend estará disponible en: **http://127.0.0.1:8000**

## 📱 Características del Frontend

### Páginas Disponibles

1. **Dashboard** (`/`)
   - Estadísticas generales
   - Pedidos recientes
   - Accesos rápidos

2. **Pedidos** (`/pedidos`)
   - Lista completa de pedidos
   - Detalles de cada pedido
   - Estado de pedidos

3. **Crear Pedido** (`/crear-pedido`)
   - Selección de cliente
   - Agregar productos
   - Cálculo automático del total

4. **Productos** (`/productos`)
   - Catálogo visual de productos
   - Información de stock
   - Precios y categorías

5. **Clientes** (`/clientes`)
   - Lista de clientes registrados
   - Información de contacto

### Diseño y UX

- **Diseño Moderno**: Inspirado en shadcn/ui
- **Responsive**: Adaptado para móviles y escritorio
- **Iconos**: Lucide React para consistencia visual
- **Colores**: Paleta de colores profesional con TailwindCSS
- **Navegación**: Barra de navegación intuitiva
- **Feedback**: Indicadores de carga y estados

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción

# Calidad de código
npm run lint         # Ejecutar linter
```

## 🎨 Personalización

### Colores

Los colores se pueden personalizar en `src/index.css` modificando las variables CSS:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... más variables */
}
```

### Componentes UI

Los componentes UI base están en `src/components/ui/`:
- `button.jsx` - Botones con variantes
- `card.jsx` - Tarjetas
- `input.jsx` - Campos de entrada
- `badge.jsx` - Etiquetas

Puedes modificar estos componentes para ajustar el diseño.

## 🔌 Integración con la API

El servicio API está en `src/services/api.js`. Actualmente incluye:

- `getPedidos()` - Obtener todos los pedidos
- `getPedido(id)` - Obtener un pedido específico
- `createPedido(data)` - Crear nuevo pedido
- `getClientes()` - Obtener clientes (mock)
- `getProductos()` - Obtener productos (mock)

**Nota**: Los endpoints de clientes y productos están mockeados porque no existen en la API de Django actual. Si agregas estos endpoints en Django, actualiza el servicio `api.js` para usar los endpoints reales.

## 🐛 Solución de Problemas

### Error: "node: command not found"

**Solución**: Instalar Node.js desde https://nodejs.org/

### Error: "Cannot find module"

**Solución**: Ejecutar `npm install` en el directorio `frontend`

### Error de CORS

**Solución**: Verificar que el backend de Django tenga CORS configurado correctamente en `config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Frontend no se conecta al Backend

**Solución**: 
1. Verificar que el backend esté corriendo en `http://127.0.0.1:8000`
2. Verificar que `VITE_API_URL` esté configurado correctamente en `.env`
3. Verificar que el proxy en `vite.config.js` esté configurado

### Errores de compilación

**Solución**: 
1. Borrar `node_modules` y `package-lock.json`
2. Ejecutar `npm install` nuevamente
3. Reiniciar el servidor de desarrollo

## 📦 Construcción para Producción

```bash
# Construir el proyecto
npm run build

# El resultado estará en la carpeta dist/
# Esta carpeta contiene los archivos optimizados para producción
```

Para servir los archivos estáticos desde Django:

1. Construir el frontend: `npm run build`
2. Copiar la carpeta `dist/` a `static/` de Django
3. Configurar Django para servir `index.html`
4. Actualizar URLs de Django para manejar routing del cliente

## 🚀 Despliegue

Para despliegue en producción, consulta el archivo `DEPLOYMENT.md` en la raíz del proyecto.

Opciones de despliegue:
- **Vercel** - Recomendado para frontend
- **Netlify** - Alternativa gratuita
- **Railway** - Backend + Frontend juntos
- **Render** - Backend + Frontend juntos

## 📞 Soporte

Si encuentras algún problema:

1. Revisa la consola del navegador para errores
2. Revisa la terminal donde corre el servidor de desarrollo
3. Verifica que el backend esté funcionando correctamente
4. Consulta la documentación de React, Vite y TailwindCSS

## ✅ Checklist Antes de Usar

- [ ] Node.js instalado (v18+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Backend de Django corriendo
- [ ] CORS configurado en Django
- [ ] Servidor de desarrollo iniciado (`npm run dev`)

¡Disfruta usando SportCore! 🎉
