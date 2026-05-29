from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from sportcore_app.models import Pedido, Producto, Cliente
from django.db.models import Sum, Count
from datetime import datetime, timedelta


@require_http_methods(["GET"])
def public_stats(request):
    """
    Servicio a proveer: Exponer estadísticas públicas del sistema
    Endpoint: /api/public/stats
    """
    try:
        # Estadísticas de los últimos 30 días
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        recent_orders = Pedido.objects.filter(fecha__gte=thirty_days_ago)
        total_revenue = recent_orders.aggregate(total=Sum('total'))['total'] or 0
        total_orders = recent_orders.count()
        
        # Productos más vendidos
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT pp.producto_id, p.nombre, SUM(dp.cantidad) as total_sold
                FROM pedidos_detallepedido dp
                JOIN pedidos_pedido pp ON dp.pedido_id = pp.id
                JOIN productos_producto p ON dp.producto_id = p.id
                WHERE pp.fecha >= %s
                GROUP BY pp.producto_id, p.nombre
                ORDER BY total_sold DESC
                LIMIT 5
            """, [thirty_days_ago])
            top_products = cursor.fetchall()
        
        top_products_data = [
            {'id': row[0], 'name': row[1], 'sold': row[2]}
            for row in top_products
        ]
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'period': 'last_30_days',
                'total_revenue': float(total_revenue),
                'total_orders': total_orders,
                'total_products': Producto.objects.count(),
                'total_clients': Cliente.objects.count(),
                'top_products': top_products_data,
                'generated_at': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@require_http_methods(["GET"])
def public_products(request):
    """
    Servicio a proveer: Exponer catálogo de productos
    Endpoint: /api/public/products
    """
    try:
        productos = Producto.objects.all()
        products_data = []
        
        for producto in productos:
            products_data.append({
                'id': producto.id,
                'name': producto.nombre,
                'description': producto.descripcion,
                'price': float(producto.precio),
                'stock': producto.stock,
                'category': {
                    'id': producto.categoria.id,
                    'name': producto.categoria.nombre
                } if producto.categoria else None
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'count': len(products_data),
                'products': products_data
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
