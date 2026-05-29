# SportCore Architecture - Microservices

## 🏗️ System Architecture

### High-Level Architecture

```
                    ┌─────────────────────────────────────┐
                    │         AWS Academy EC2             │
                    │                                     │
                    │  ┌───────────────────────────────┐  │
                    │  │      Nginx (API Gateway)     │  │
                    │  │         Port 80               │  │
                    │  │  - Load Balancing            │  │
                    │  │  - SSL Termination           │  │
                    │  │  - Request Routing            │  │
                    │  └───────────┬───────────────────┘  │
                    │              │                      │
                    │  ┌───────────┴───────────────────┐  │
                    │  │                               │  │
                    │  ▼                               ▼  │
                    │  ┌──────────────┐    ┌────────────────┐
                    │  │   Django     │    │  Flask (MS)    │
                    │  │  (Monolito)  │    │  Productos     │
                    │  │  Port 8000   │    │  Port 5001     │
                    │  │              │    │                │
                    │  │  - Clientes  │    │  - Productos   │
                    │  │  - Categorías│    │  - Stock       │
                    │  │  - Admin     │    │  - Pricing     │
                    │  └──────┬───────┘    └────────┬───────┘
                    │         │                     │      │
                    │  ┌──────┴─────────────────────┴──────┐ │
                    │  │                                    │ │
                    │  ▼                                    │ │
                    │  ┌──────────────┐                     │ │
                    │  │  Flask (MS)  │                     │ │
                    │  │  Pedidos     │                     │ │
                    │  │  Port 5002   │                     │ │
                    │  │              │                     │ │
                    │  │  - Pedidos   │                     │ │
                    │  │  - Detalles  │                     │ │
                    │  └──────┬───────┘                     │ │
                    │         │                              │ │
                    │  ┌──────┴────────────────────────────┐ │ │
                    │  │                                     │ │
                    │  ▼                                     │ │
                    │  ┌──────────────┐    ┌────────────────┐ │ │
                    │  │ PostgreSQL   │    │  Redis +       │ │ │
                    │  │  Port 5432   │    │  Celery        │ │ │
                    │  │              │    │  Port 6379     │ │ │
                    │  │  - Clientes  │    │                │ │ │
                    │  │  - Productos │    │  - Message     │ │ │
                    │  │  - Pedidos   │    │    Broker     │ │ │
                    │  │  - Categorías│    │  - Task Queue  │ │ │
                    │  └──────────────┘    └────────────────┘ │ │
                    │                                     │ │
                    │  ┌───────────────────────────────┐  │ │
                    │  │     React Frontend            │  │ │
                    │  │     Port 5173                 │  │ │
                    │  │                               │  │ │
                    │  │  - Dashboard                  │  │ │
                    │  │  - Product Catalog             │  │ │
                    │  │  - Order Management            │  │ │
                    │  │  - Client Management           │  │ │
                    │  │  - i18n Support (EN/ES)        │  │ │
                    │  └───────────────────────────────┘  │ │
                    │                                     │ │
                    └─────────────────────────────────────┘
```

## 🎯 Strangler Pattern Implementation

### Migration Strategy

The migration from monolith to microservices follows the **Strangler Pattern**:

1. **Phase 1**: Keep Django monolith handling all functionality
2. **Phase 2**: Extract Productos to Flask microservice
3. **Phase 3**: Extract Pedidos to Flask microservice
4. **Phase 4**: Keep Clientes in Django (legacy support)
5. **Phase 5**: Gradual migration of remaining services

### API Gateway Routing

Nginx routes requests based on path:

| Path | Service | Purpose |
|------|---------|---------|
| `/api/clientes/*` | Django | Client management |
| `/api/categorias/*` | Django | Category management |
| `/api/productos/*` | Flask MS | Product management |
| `/api/pedidos/*` | Flask MS | Order management |
| `/api/public/*` | Django | Public API (service to provide) |
| `/api/ally/*` | Django | Ally service proxy (service to consume) |
| `/` | React | Frontend application |

## 🔄 Communication Patterns

### Synchronous Communication

```
Frontend → Nginx → Service → Database
```

- HTTP/REST API
- JSON format
- CORS enabled

### Asynchronous Communication

```
Django → Celery → Redis → Celery Worker → Task Execution
```

- Message Broker: Redis
- Task Queue: Celery
- Use Cases:
  - Email notifications
  - Report generation
  - Stock updates
  - Low stock alerts

### Inter-Service Communication

```
Pedidos MS → HTTP → Productos MS
```

- Service-to-service HTTP calls
- Circuit breaker pattern (recommended for production)
- Retry logic with exponential backoff

## 📊 Data Architecture

### Database Schema

```
PostgreSQL Database: sportcore
├── clientes_cliente (Django)
├── categorias_categoria (Django)
├── productos_producto (Shared)
├── pedidos_pedido (Shared)
└── pedidos_detallepedido (Shared)
```

### Data Consistency

- **Single Source of Truth**: PostgreSQL
- **Shared Tables**: Productos and Pedidos tables shared between Django and Flask
- **Foreign Keys**: Maintained across services
- **Transactions**: Database-level ACID compliance

## 🔐 Security Architecture

### Authentication & Authorization

- **Django Admin**: Built-in authentication
- **API**: Currently open (for academic purposes)
- **Future**: JWT tokens, OAuth2

### Network Security

- **Security Groups**: AWS EC2 firewall rules
- **Internal Communication**: Docker network isolation
- **API Gateway**: Nginx as single entry point

### Data Security

- **Environment Variables**: Sensitive data in `.env`
- **Database**: PostgreSQL with user authentication
- **Secrets**: Django SECRET_KEY for session management

## 🌐 Internationalization (i18n)

### Backend (Django)

- **gettext**: Translation framework
- **Languages**: English (en), Spanish (es)
- **Location**: `sportcore/locale/`
- **Usage**: `gettext_lazy()` for model fields

### Frontend (React)

- **Context API**: Language state management
- **Translations**: JSON-based translation files
- **Languages**: English (en), Spanish (es)
- **Location**: `frontend/src/i18n/`
- **Usage**: `useTranslation()` hook

### Microservices (Flask)

- **gettext**: Translation framework (to be implemented)
- **Future**: Flask-Babel extension

## 🔌 External Integrations

### Service to Provide (Our API)

**Endpoints**:
- `GET /api/public/stats/` - Public statistics
- `GET /api/public/products/` - Product catalog

**Purpose**: Expose system data for external consumption

### Service to Consume (Ally Team)

**Endpoints**:
- `GET /api/ally/users/` - Proxy to ally's users
- `GET /api/ally/posts/` - Proxy to ally's posts
- `GET /api/integrated/dashboard/` - Combined dashboard

**Purpose**: Consume ally team's service and display in our UI

### Third-Party API (Adapter Pattern)

**Implementation**: `sportcore_app/infra/adapters.py`

**Adapters**:
- `JSONPlaceholderAdapter`: Example API
- `WeatherAPIAdapter`: Weather data API
- `ExternalAPIService`: Service layer using adapters

**Pattern**: Dependency Inversion Principle (DIP)

## 📦 Technology Stack

### Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Django | 6.0.2 |
| API | Django REST Framework | 3.15.2 |
| Database | PostgreSQL | 15 |
| Message Broker | Redis | 7 |
| Task Queue | Celery | 5.3.6 |
| Microservices | Flask | 3.0.0 |
| API Gateway | Nginx | Alpine |

### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18 |
| Build Tool | Vite | Latest |
| Styling | TailwindCSS | Latest |
| Components | shadcn/ui | Latest |
| Routing | React Router | Latest |
| HTTP Client | Axios | Latest |
| Icons | Lucide React | Latest |

### DevOps

| Component | Technology | Version |
|-----------|-----------|---------|
| Containerization | Docker | Latest |
| Orchestration | Docker Compose | 3.8 |
| Cloud Platform | AWS Academy | EC2 |
| Version Control | Git | Latest |

## 🚀 Deployment Architecture

### AWS Academy Environment

```
AWS Academy Account
└── EC2 Instance (Ubuntu 22.04)
    ├── Docker
    ├── Docker Compose
    └── SportCore Services
        ├── Nginx (Port 80)
        ├── Django (Port 8000)
        ├── Productos MS (Port 5001)
        ├── Pedidos MS (Port 5002)
        ├── PostgreSQL (Port 5432)
        ├── Redis (Port 6379)
        ├── Celery Worker
        ├── Celery Beat
        └── React Frontend (Port 5173)
```

### Docker Compose Services

| Service | Image | Ports | Dependencies |
|---------|-------|-------|--------------|
| postgres | postgres:15-alpine | 5432 | - |
| redis | redis:7-alpine | 6379 | - |
| django | sportcore/django | 8000 | postgres, redis |
| celery_worker | sportcore/django | - | postgres, redis, django |
| celery_beat | sportcore/django | - | postgres, redis, django |
| productos | sportcore/productos | 5001 | postgres |
| pedidos | sportcore/pedidos | 5002 | postgres, productos |
| frontend | sportcore/frontend | 5173 | django, productos, pedidos |
| nginx | nginx:alpine | 80 | django, productos, pedidos, frontend |

## 📈 Monitoring & Observability

### Health Checks

- **Nginx**: `/health/`
- **Django**: `/api/health/`
- **Productos MS**: `/health`
- **Pedidos MS**: `/health`

### Logging

- **Docker Logs**: `docker-compose logs [service]`
- **Application Logs**: Console output
- **Future**: CloudWatch Logs, ELK Stack

### Metrics

- **Docker Stats**: `docker stats`
- **Future**: Prometheus, Grafana

## 🔄 CI/CD Pipeline (Future)

### GitHub Actions Workflow

```yaml
1. Code Push
2. Run Tests
3. Build Docker Images
4. Push to Registry
5. Deploy to AWS
6. Health Check
7. Rollback if failed
```

## 🎓 Design Patterns Implemented

1. **Strangler Pattern**: Gradual migration to microservices
2. **Adapter Pattern**: Third-party API integration
3. **Factory Pattern**: Adapter creation
4. **Repository Pattern**: Data access abstraction
5. **Service Layer Pattern**: Business logic separation
6. **API Gateway Pattern**: Nginx routing
7. **Message Broker Pattern**: Async task processing

## 📝 Notes

- This architecture is designed for academic purposes (AWS Academy)
- Production deployment would require additional security measures
- SSL/TLS should be implemented for production
- Authentication/Authorization should be added for APIs
- Monitoring and alerting should be configured
- Backup and disaster recovery strategy needed

---

**Last Updated**: May 28, 2026
