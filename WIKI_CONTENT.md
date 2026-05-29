# SportCore Wiki

## 📖 Índice
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Guía de Instalación](#guía-de-instalación)
- [Guía de Uso](#guía-de-uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contribución](#contribución)

---

## 🎯 Descripción del Proyecto

SportCore es un sistema de gestión deportiva completo con arquitectura limpia y diseño moderno. El sistema permite gestionar pedidos, productos, clientes y categorías de productos deportivos.

### Características Principales
- ✅ Gestión de clientes
- ✅ Catálogo de productos deportivos
- ✅ Sistema de pedidos completo
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Diseño deportivo moderno (azul oscuro y verde)
- ✅ Arquitectura limpia (DDD - Domain Driven Design)
- ✅ API REST con Django REST Framework
- ✅ Frontend React con TailwindCSS

---

## 🏗️ Arquitectura del Sistema

### Backend - Arquitectura Limpia
```
sportcore_app/
├── domain/          # Lógica de dominio y entidades
│   ├── builders.py  # Builders para crear objetos complejos
│   └── __init__.py
├── application/     # Casos de uso y servicios de aplicación
│   └── services.py
├── infra/           # Infraestructura y persistencia
│   ├── factories.py # Factories para crear objetos
│   └── pagos.py     # Integración con servicios de pago
├── models.py        # Modelos Django
├── serializers.py   # Serializadores DRF
├── api_views.py     # Vistas API
└── api_urls.py      # Rutas API
```

### Frontend - React + Vite
```
frontend/
├── src/
│   ├── components/  # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   └── ui/      # Componentes shadcn/ui
│   ├── pages/       # Páginas de la aplicación
│   │   ├── Dashboard.jsx
│   │   ├── Pedidos.jsx
│   │   ├── CrearPedido.jsx
│   │   ├── Productos.jsx
│   │   └── Clientes.jsx
│   ├── services/    # Servicios API
│   │   └── api.js
│   └── utils/       # Utilidades
│       └── utils.js
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.x**
- **Django 6.0.2** - Framework web
- **Django REST Framework** - API REST
- **django-cors-headers** - Configuración CORS
- **SQLite** - Base de datos (desarrollo)

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

---

## 🚀 Guía de Instalación

### Requisitos Previos
- Python 3.8+
- Node.js 18+
- npm o yarn

### Instalación del Backend

1. **Clonar el repositorio**
```bash
git clone https://github.com/zrsebas/arquitecturasoftware.git
cd arquitecturasoftware/sportcore
```

2. **Crear entorno virtual**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Ejecutar migraciones**
```bash
python manage.py migrate
```

5. **Crear superusuario (opcional)**
```bash
python manage.py createsuperuser
```

6. **Iniciar servidor Django**
```bash
python manage.py runserver
```
El backend estará disponible en: http://127.0.0.1:8000

### Instalación del Frontend

1. **Navegar al directorio frontend**
```bash
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```
El frontend estará disponible en: http://localhost:5173

---

## 📚 Guía de Uso

### Dashboard
- Muestra estadísticas en tiempo real
- Total de pedidos, pedidos confirmados, clientes activos, ingresos totales
- Lista de pedidos recientes con estado
- Accesos rápidos a todas las secciones

### Gestión de Pedidos
- **Ver Pedidos**: Lista todos los pedidos con detalles completos
- **Crear Pedido**: Formulario para crear nuevos pedidos
  - Seleccionar cliente
  - Agregar productos
  - Ver resumen antes de enviar

### Catálogo de Productos
- Ver todos los productos disponibles
- Filtrar por categoría
- Ver stock y precios
- Diseño con cards modernas

### Gestión de Clientes
- Lista de clientes registrados
- Información de contacto
- Direcciones de entrega

---

## 📁 Estructura del Proyecto

```
arquitecturasoftware/
├── sportcore/
│   ├── config/              # Configuración Django
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── sportcore_app/       # Aplicación principal
│   │   ├── domain/          # Dominio
│   │   ├── application/     # Aplicación
│   │   ├── infra/           # Infraestructura
│   │   ├── migrations/      # Migraciones DB
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── api_views.py
│   │   ├── api_urls.py
│   │   └── urls.py
│   ├── frontend/            # Frontend React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── manage.py
│   ├── requirements.txt
│   ├── README.md
│   └── DEPLOYMENT.md
└── .gitignore
```

---

## 🔌 API Endpoints

### Clientes
- `GET /api/clientes/` - Listar todos los clientes
- `POST /api/clientes/` - Crear nuevo cliente
- `GET /api/clientes/{id}/` - Obtener cliente por ID
- `PUT /api/clientes/{id}/` - Actualizar cliente
- `DELETE /api/clientes/{id}/` - Eliminar cliente

### Productos
- `GET /api/productos/` - Listar todos los productos
- `POST /api/productos/` - Crear nuevo producto
- `GET /api/productos/{id}/` - Obtener producto por ID
- `PUT /api/productos/{id}/` - Actualizar producto
- `DELETE /api/productos/{id}/` - Eliminar producto

### Categorías
- `GET /api/categorias/` - Listar todas las categorías
- `POST /api/categorias/` - Crear nueva categoría
- `GET /api/categorias/{id}/` - Obtener categoría por ID
- `PUT /api/categorias/{id}/` - Actualizar categoría
- `DELETE /api/categorias/{id}/` - Eliminar categoría

### Pedidos
- `GET /api/pedidos/` - Listar todos los pedidos
- `POST /api/pedidos/` - Crear nuevo pedido
- `GET /api/pedidos/{id}/` - Obtener pedido por ID
- `PUT /api/pedidos/{id}/` - Actualizar pedido
- `DELETE /api/pedidos/{id}/` - Eliminar pedido

---

## 🌐 Deployment

### Backend (Django)

#### Opción 1: Heroku
1. Crear archivo `Procfile`:
```
web: gunicorn config.wsgi:application
```

2. Crear archivo `runtime.txt`:
```
python-3.11.0
```

3. Desplegar:
```bash
heroku create sportcore-backend
git push heroku main
```

#### Opción 2: Railway/Render
Subir el código y configurar las variables de entorno en la plataforma.

### Frontend (React)

#### Opción 1: Vercel
```bash
npm install -g vercel
vercel
```

#### Opción 2: Netlify
```bash
npm run build
# Subir la carpeta dist/ a Netlify
```

### Variables de Entorno
- `DJANGO_SECRET_KEY` - Clave secreta de Django
- `DATABASE_URL` - URL de base de datos
- `ALLOWED_HOSTS` - Hosts permitidos
- `CORS_ALLOWED_ORIGINS` - Orígenes CORS permitidos

---

## 🤝 Contribución

### Cómo Contribuir
1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

### Código de Conducta
- Ser respetuoso con otros contribuidores
- Seguir el estilo de código existente
- Escribir commits claros y descriptivos
- Documentar cambios importantes

### Reportar Issues
Si encuentras un bug o tienes una sugerencia:
1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducir
4. Adjunta capturas de pantalla si es necesario

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

---

## 👥 Autores

- **Sebastián** - Desarrollador principal - [@zrsebas](https://github.com/zrsebas)

---

## 🙏 Agradecimientos

- Django REST Framework
- React y la comunidad
- shadcn/ui por los componentes
- TailwindCSS por el framework CSS

---

## 📞 Contacto

Para preguntas o soporte:
- GitHub Issues: https://github.com/zrsebas/arquitecturasoftware/issues
- Email: [tu-email@example.com]

---

**Última actualización**: Mayo 2026
