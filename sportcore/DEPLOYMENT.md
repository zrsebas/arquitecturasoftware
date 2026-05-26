# Guía de Despliegue - SportCore

Esta guía explica cómo desplegar el proyecto completo (Backend Django + Frontend React) en diferentes plataformas.

## 📋 Requisitos Previos

- Python 3.8+
- Node.js 18+
- Git
- Cuenta en plataforma de despliegue (Heroku, Vercel, Netlify, etc.)

## 🚀 Despliegue Local

### Backend

```bash
# Activar entorno virtual
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Migrar base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### Frontend

```bash
# Navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## ☁️ Despliegue en Producción

### Opción 1: Heroku (Backend) + Vercel (Frontend)

#### Backend en Heroku

1. **Crear archivo `Procfile` en la raíz:**
```
web: gunicorn config.wsgi:application
```

2. **Crear archivo `runtime.txt`:**
```
python-3.11.0
```

3. **Instalar gunicorn:**
```bash
pip install gunicorn
```

4. **Actualizar `requirements.txt`:**
```
django==6.0.2
djangorestframework==3.15.2
django-cors-headers==4.4.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

5. **Configurar Heroku:**
```bash
# Instalar Heroku CLI
# Login
heroku login

# Crear app
heroku create sportcore-backend

# Configurar variables de entorno
heroku config:set DJANGO_SETTINGS_MODULE=config.settings
heroku config:set SECRET_KEY=tu-secret-key
heroku config:set ALLOWED_HOSTS=sportcore-backend.herokuapp.com

# Configurar PostgreSQL (recomendado)
heroku addons:create heroku-postgresql:mini

# Push a Heroku
git push heroku main

# Migrar base de datos
heroku run python manage.py migrate

# Crear superusuario
heroku run python manage.py createsuperuser
```

6. **Actualizar CORS en `settings.py`:**
```python
CORS_ALLOWED_ORIGINS = [
    "https://tu-frontend.vercel.app",
]
```

#### Frontend en Vercel

1. **Instalar Vercel CLI:**
```bash
npm i -g vercel
```

2. **Conectar repositorio a Vercel**

3. **Configurar variables de entorno en Vercel:**
```
VITE_API_URL=https://sportcore-backend.herokuapp.com
```

4. **Desplegar:**
```bash
cd frontend
vercel
```

### Opción 2: Railway (Backend + Frontend)

Railway permite desplegar ambos servicios en una sola plataforma.

1. **Crear cuenta en [railway.app](https://railway.app)**

2. **Crear proyecto desde GitHub**

3. **Agregar servicio Django:**
   - Seleccionar repositorio
   - Railway detectará automáticamente Django
   - Configurar comando de inicio: `python manage.py runserver 0.0.0.0:$PORT`

4. **Agregar servicio React:**
   - Seleccionar repositorio
   - Configurar directorio: `frontend`
   - Configurar comando de inicio: `npm run dev`
   - Configurar variables de entorno

5. **Configurar variables de entorno para Django:**
```
DJANGO_SETTINGS_MODULE=config.settings
SECRET_KEY=tu-secret-key
ALLOWED_HOSTS=.railway.app
```

6. **Configurar variables de entorno para React:**
```
VITE_API_URL=https://tu-django-service.railway.app
```

### Opción 3: Render (Backend + Frontend)

Render es otra opción gratuita para desplegar aplicaciones web.

#### Backend en Render

1. **Crear cuenta en [render.com](https://render.com)**

2. **Crear Web Service:**
   - Seleccionar "Web Service"
   - Conectar repositorio GitHub
   - Configurar:
     - Runtime: Python
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn config.wsgi:application`

3. **Configurar variables de entorno:**
```
DJANGO_SETTINGS_MODULE=config.settings
SECRET_KEY=tu-secret-key
ALLOWED_HOSTS=tu-app.onrender.com
```

4. **Configurar base de datos PostgreSQL**

5. **Ejecutar migraciones:**
```bash
# En Render, configurar un comando de deploy
python manage.py migrate
```

#### Frontend en Render

1. **Crear Static Site:**
   - Seleccionar "Static Site"
   - Conectar repositorio GitHub
   - Configurar:
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Publish Directory: `dist`

2. **Configurar variables de entorno:**
```
VITE_API_URL=https://tu-backend.onrender.com
```

## 🔒 Configuración de Seguridad para Producción

### Django Settings

```python
# settings.py

DEBUG = False

SECRET_KEY = os.environ.get('SECRET_KEY')

ALLOWED_HOSTS = ['tu-dominio.com', '.tu-plataforma.com']

# Base de datos PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "https://tu-frontend.com",
]

# HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

### Frontend Environment

```bash
# .env.production
VITE_API_URL=https://tu-backend.com
```

## 📊 Monitoreo y Logs

### Heroku

```bash
# Ver logs
heroku logs --tail

# Ver métricas
heroku ps
```

### Vercel

- Los logs están disponibles en el dashboard de Vercel
- Métricas en la pestaña "Analytics"

### Railway

- Logs disponibles en el dashboard
- Métricas en la pestaña "Metrics"

## 🔄 CI/CD

### GitHub Actions

Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "sportcore-backend"
          heroku_email: "tu-email@example.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

## 🧪 Testing antes del Despliegue

### Backend

```bash
# Ejecutar tests
python manage.py test

# Verificar migraciones
python manage.py check

# Verificar configuración
python manage.py collectstatic --dry-run
```

### Frontend

```bash
# Ejecutar tests
npm run test

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## 📝 Checklist de Despliegue

- [ ] Configurar variables de entorno
- [ ] Cambiar DEBUG = False
- [ ] Configurar ALLOWED_HOSTS
- [ ] Configurar base de datos PostgreSQL
- [ ] Configurar CORS correctamente
- [ ] Ejecutar migraciones
- [ ] Crear superusuario
- [ ] Configurar HTTPS
- [ ] Configurar archivos estáticos
- [ ] Probar API endpoints
- [ ] Probar frontend completo
- [ ] Configurar monitoreo
- [ ] Configurar backups
- [ ] Configurar dominio personalizado (opcional)

## 🆘 Solución de Problemas Comunes

### Error de CORS

Verificar que `CORS_ALLOWED_ORIGINS` incluya la URL del frontend.

### Error de Base de Datos

Asegurarse de que las credenciales de la base de datos estén configuradas correctamente en las variables de entorno.

### Error de Archivos Estáticos

Ejecutar `python manage.py collectstatic` antes del despliegue.

### Frontend no se conecta al Backend

Verificar que `VITE_API_URL` esté configurada correctamente y que el backend esté accesible.

## 📞 Soporte

Para más información, consultar:
- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de TailwindCSS](https://tailwindcss.com/)
