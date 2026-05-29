from django.urls import path
from .api_views import PedidoAPIView
from .api_views_clientes import ClienteAPIView
from .api_views_productos import ProductoAPIView

app_name = 'api'

urlpatterns = [
    # Pedidos
    path('pedidos/', PedidoAPIView.as_view(), name='pedido-list-create'),
    path('pedidos/<int:pedido_id>/', PedidoAPIView.as_view(), name='pedido-detail'),
    
    # Clientes
    path('clientes/', ClienteAPIView.as_view(), name='cliente-list-create'),
    
    # Productos
    path('productos/', ProductoAPIView.as_view(), name='producto-list-create'),
]
