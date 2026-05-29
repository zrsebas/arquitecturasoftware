from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from sportcore_app.views import HomeView, ProcesarPedidoView
from sportcore_app import views_public, views_ally, views_frontend
from sportcore_app.api_views import PedidoAPIView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Routes
    path('api/', include('sportcore_app.api_urls')),
    path('api/pedido/', csrf_exempt(ProcesarPedidoView.as_view())),
    
    # Public API endpoints (Servicio a proveer)
    path('api/public/stats/', views_public.public_stats),
    path('api/public/products/', views_public.public_products),
    
    # Ally service endpoints (Servicio a consumir)
    path('api/ally/users/', views_ally.ally_users),
    path('api/ally/posts/', views_ally.ally_posts),
    path('api/integrated/dashboard/', views_ally.integrated_dashboard),
    
    # Frontend routes (specific routes)
    path('', views_frontend.serve_frontend, name='frontend'),
    path('clientes/', views_frontend.serve_frontend, name='clientes'),
    path('productos/', views_frontend.serve_frontend, name='productos'),
    path('pedidos/', views_frontend.serve_frontend, name='pedidos'),
    path('crear-pedido/', views_frontend.serve_frontend, name='crear-pedido'),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
