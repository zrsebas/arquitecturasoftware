# SportCore - Microservices Architecture

🏆 **Sistema de Gestión Deportiva con Arquitectura de Microservicios**

## 📋 Overview

SportCore es un sistema de gestión deportiva que ha evolucionado de una arquitectura monolítica a un ecosistema híbrido de microservicios, implementando el **Strangler Pattern** para una migración gradual y resiliente.

### 🎯 Entrega 2: Migración a Microservicios

Esta entrega implementa:
- ✅ **Arquitectura Híbrida**: Django monolito + Flask microservicios
- ✅ **API Gateway**: Nginx para ruteo profesional
- ✅ **Comunicación Asíncrona**: Redis + Celery
- ✅ **Internacionalización (i18n)**: Soporte bilingüe (EN/ES)
- ✅ **Integración de Servicios**: Servicio a proveer, consumir, y terceros
- ✅ **Despliegue AWS Academy**: Docker Compose en EC2
- ✅ **Adapter Pattern**: Integración con APIs externas

## 🏗️ Arquitectura del Sistema

```
                    ┌─────────────────────────────────────┐
                    │         AWS Academy EC2             │
                    │                                     │
                    │  ┌───────────────────────────────┐  │
                    │  │      Nginx (API Gateway)     │  │
                    │  │         Port 80               │  │
                    │  └───────────┬───────────────────┘  │
                    │              │                      │
                    │  ┌───────────┴───────────────────┐  │
                    │  │                               │  │
                    │  ▼                               ▼  │
                    │  ┌──────────────┐    ┌────────────────┐
                    │  │   Django     │    │  Flask (MS)    │
                    │  │  (Monolito)  │    │  Productos     │
                    │  │  Port 8000   │    │  Port 5001     │
                    │  └──────┬───────┘    └────────┬───────┘
                    │         │                     │      │
                    │  ┌──────┴─────────────────────┴──────┐ │
                    │  │                                    │ │
                    │  ▼                                    │ │
                    │  ┌──────────────┐                     │ │
                    │  │  Flask (MS)  │                     │ │
                    │  │  Pedidos     │                     │ │
                    │  │  Port 5002   │                     │ │
                    │  └──────┬───────┘                     │ │
                    │         │                              │ │
                    │  ┌──────┴────────────────────────────┐ │ │
                    │  │                                     │ │
                    │  ▼                                     │ │
                    │  ┌──────────────┐    ┌────────────────┐ │ │
                    │  │ PostgreSQL   │    │  Redis +       │ │ │
                    │  │  Port 5432   │    │  Celery        │ │ │
                    │  └──────────────┘    └────────────────┘ │ │
                    │                                     │ │
                    │  ┌───────────────────────────────┐  │ │
                    │  │     React Frontend            │  │ │
                    │  │     Port 5173                 │  │ │
                    │  └───────────────────────────────┘  │ │
                    │                                     │ │
                    └─────────────────────────────────────┘
```

## 🚀 Características Principales

### Backend Services

| Servicio | Tecnología | Puerto | Responsabilidades |
|----------|------------|--------|-------------------|
| Django (Monolito) | Django 6.0.2 | 8000 | Clientes, Categorías, Admin |
| Productos MS | Flask 3.0.0 | 5001 | Gestión de productos |
| Pedidos MS | Flask 3.0.0 | 5002 | Gestión de pedidos |
| Nginx Gateway | Nginx Alpine | 80 | API Gateway, Load Balancing |
| PostgreSQL | PostgreSQL 15 | 5432 | Base de datos |
| Redis | Redis 7 | 6379 | Message Broker |
| Celery Worker | Celery 5.3.6 | - | Tareas asíncronas |
| Celery Beat | Celery Beat | - | Programador de tareas |

### Frontend

- **React 18** + **Vite** - Framework moderno
- **TailwindCSS** - Estilos utilitarios
- **shadcn/ui** - Componentes UI
- **i18n Support** - Inglés y Español
- **Diseño Deportivo** - Tema azul oscuro y verde

## 📦 Estructura del Proyecto

```
arquitecturasoftware/
├── docker-compose.yml          # Orquestación Docker
├── .env.example               # Variables de entorno
├── DEPLOYMENT_AWS.md         # Guía de despliegue AWS
├── ARCHITECTURE.md           # Documentación de arquitectura
├── sportcore/                # Proyecto Django
│   ├── config/               # Configuración Django
│   │   ├── settings.py       # Configuración con PostgreSQL, Celery
│   │   ├── celery.py         # Configuración Celery
│   │   └── urls.py           # URLs con endpoints públicos
│   ├── sportcore_app/        # Aplicación principal
│   │   ├── domain/           # Domain Layer (DDD)
│   │   ├── application/      # Service Layer
│   │   ├── infra/            # Infrastructure Layer
│   │   │   └── adapters.py   # Adapter Pattern para APIs externas
│   │   ├── tasks.py          # Tareas Celery asíncronas
│   │   ├── views_public.py   # Endpoints públicos (servicio a proveer)
│   │   └── views_ally.py     # Endpoints de servicio aliado
│   ├── locale/               # Archivos de traducción i18n
│   │   ├── en/               # Inglés
│   │   └── es/               # Español
│   ├── Dockerfile            # Docker para Django
│   └── frontend/             # Frontend React
│       ├── src/
│       │   ├── i18n/         # Sistema de traducciones
│       │   ├── components/   # Componentes React
│       │   └── pages/        # Páginas de la app
│       └── Dockerfile        # Docker para React
├── microservicios/            # Microservicios Flask
│   ├── productos/            # MS de Productos
│   │   ├── app.py            # Aplicación Flask
│   │   ├── requirements.txt  # Dependencias
│   │   └── Dockerfile        # Docker para Productos
│   └── pedidos/              # MS de Pedidos
│       ├── app.py            # Aplicación Flask
│       ├── requirements.txt  # Dependencias
│       └── Dockerfile        # Docker para Pedidos
└── nginx/                    # Configuración Nginx
    └── nginx.conf            # Configuración API Gateway
```

## 🛠️ Instalación y Despliegue

### Prerrequisitos

- Docker y Docker Compose
- Python 3.11+
- Node.js 18+
- Cuenta AWS Academy

### Despliegue Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/zrsebas/arquitecturasoftware.git
cd arquitecturasoftware
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Iniciar todos los servicios**
```bash
docker-compose up -d --build
```

4. **Verificar servicios**
```bash
docker-compose ps
```

5. **Acceder a la aplicación**
- Frontend: http://localhost:80
- Django Admin: http://localhost:8000/admin
- API Gateway: http://localhost:80/api/

### Despliegue en AWS Academy

Ver guía completa en [DEPLOYMENT_AWS.md](DEPLOYMENT_AWS.md)

## 🔌 API Endpoints

### Servicio a Proveer (Nuestra API)

- `GET /api/public/stats/` - Estadísticas públicas del sistema
- `GET /api/public/products/` - Catálogo de productos

### Servicio a Consumir (Aliado)

- `GET /api/ally/users/` - Usuarios del servicio aliado
- `GET /api/ally/posts/` - Posts del servicio aliado
- `GET /api/integrated/dashboard/` - Dashboard integrado

### API de Terceros (Adapter Pattern)

Implementado en `sportcore_app/infra/adapters.py`:
- `JSONPlaceholderAdapter` - API de ejemplo
- `WeatherAPIAdapter` - API de clima
- `ExternalAPIService` - Servicio con inyección de dependencias

### Endpoints del Sistema

| Endpoint | Servicio | Método |
|----------|----------|--------|
| `/api/clientes/` | Django | GET, POST |
| `/api/categorias/` | Django | GET, POST |
| `/api/productos/` | Flask MS | GET, POST |
| `/api/pedidos/` | Flask MS | GET, POST |
| `/api/public/stats/` | Django | GET |
| `/api/ally/users/` | Django | GET |

## 🌐 Internacionalización (i18n)

### Backend (Django)

- **Framework**: gettext
- **Idiomas**: English (en), Spanish (es)
- **Ubicación**: `sportcore/locale/`
- **Activación**: `USE_I18N = True` en settings.py

### Frontend (React)

- **Framework**: Context API
- **Idiomas**: English (en), Spanish (es)
- **Ubicación**: `frontend/src/i18n/`
- **Uso**: `useTranslation()` hook

### Cambio de Idioma

El frontend incluye un selector de idioma en el Navbar:
- Botón con icono Globe
- Cambia entre EN/ES
- Persiste en localStorage

## 🔄 Comunicación Asíncrona

### Tareas Celery Implementadas

1. **send_order_confirmation_email** - Email de confirmación de pedido
2. **generate_daily_report** - Reporte diario de ventas
3. **update_product_stock** - Actualización de stock
4. **process_low_stock_notification** - Notificación de bajo stock

### Configuración

- **Message Broker**: Redis
- **Result Backend**: Redis
- **Scheduler**: django-celery-beat

## 🎨 Diseño Deportivo

### Paleta de Colores

- **Fondo**: Gradiente slate-900 → emerald-900 → blue-900
- **Acentos**: Emerald → Cyan
- **Texto**: Blanco y slate-300/400
- **Iconos**: Lucide React (Trophy, Target, Activity)

### Componentes

- **Glass Morphism**: Efecto cristal oscuro
- **Gradient Borders**: Bordes con gradiente
- **Hover Effects**: Transiciones suaves
- **Shadows**: Sombras brillantes

## 📊 Patrones de Diseño Implementados

1. **Strangler Pattern** - Migración gradual a microservicios
2. **Adapter Pattern** - Integración con APIs externas
3. **Factory Pattern** - Creación de adaptadores
4. **Repository Pattern** - Abstracción de acceso a datos
5. **Service Layer Pattern** - Separación de lógica de negocio
6. **API Gateway Pattern** - Nginx como gateway
7. **Message Broker Pattern** - Procesamiento asíncrono

## 🔐 Seguridad

- **PostgreSQL**: Autenticación de usuario
- **Environment Variables**: Datos sensibles en .env
- **Docker Networks**: Aislamiento de servicios
- **Nginx**: Single entry point
- **CORS**: Configurado para frontend

## 📈 Monitoreo

### Health Checks

- Nginx: `/health/`
- Django: `/api/health/`
- Productos MS: `/health`
- Pedidos MS: `/health`

### Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f django
docker-compose logs -f productos
docker-compose logs -f pedidos
```

## 🧪 Testing

### Test Local

```bash
# Iniciar servicios
docker-compose up -d

# Test endpoints
curl http://localhost/api/public/stats/
curl http://localhost/api/productos/
curl http://localhost/api/pedidos/
```

### Test AWS Academy

Seguir guía en [DEPLOYMENT_AWS.md](DEPLOYMENT_AWS.md)

## 📝 Documentación

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Documentación completa de arquitectura
- **[DEPLOYMENT_AWS.md](DEPLOYMENT_AWS.md)** - Guía de despliegue en AWS Academy
- **[WIKI_CONTENT.md](WIKI_CONTENT.md)** - Wiki del proyecto (para GitHub Wiki)

## 🎯 Requisitos de la Entrega Cumplidos

### ✅ Despliegue e Infraestructura (AWS Academy)
- Docker Compose para orquestación
- Despliegue en EC2 de AWS Academy
- Todos los servicios contenerizados

### ✅ Arquitectura y Patrón Estrangulador
- Django monolito (Clientes, Categorías)
- Flask MS (Productos, Pedidos)
- Nginx como API Gateway
- Migración gradual implementada

### ✅ Integración y Patrones Estructurales
- **Servicio a Proveer**: `/api/public/stats/`, `/api/public/products/`
- **Servicio a Consumir**: `/api/ally/users/`, `/api/ally/posts/`
- **API de Terceros**: Adapter Pattern en `infra/adapters.py`

### ✅ Comunicación Asíncrona e i18n
- **Redis/Celery**: Tareas de fondo implementadas
- **i18n Django**: gettext con EN/ES
- **i18n React**: Context API con selector de idioma
- **Usabilidad**: UI/UX auditada, navegación robusta

## 🚀 Próximos Pasos

1. **SSL/TLS**: Implementar certificados HTTPS
2. **Authentication**: JWT tokens para APIs
3. **Monitoring**: CloudWatch, Prometheus
4. **CI/CD**: GitHub Actions pipeline
5. **Scaling**: Kubernetes or ECS
6. **Logging**: ELK Stack

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch
3. Commit changes
4. Push to branch
5. Pull Request

## 📄 Licencia

MIT License

## 👥 Autores

- **Sebastián** - [@zrsebas](https://github.com/zrsebas)

---

**SportCore Microservices Architecture** - Entrega 2: Arquitectura de Software 2026

**Última Actualización**: Mayo 28, 2026
