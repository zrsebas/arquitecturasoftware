from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_order_confirmation_email(pedido_id, cliente_email):
    """
    Tarea asíncrona para enviar email de confirmación de pedido
    """
    try:
        send_mail(
            subject='Order Confirmation',
            message=f'Your order #{pedido_id} has been confirmed.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[cliente_email],
            fail_silently=False,
        )
        logger.info(f'Confirmation email sent for order #{pedido_id}')
    except Exception as e:
        logger.error(f'Failed to send confirmation email for order #{pedido_id}: {str(e)}')

@shared_task
def generate_daily_report():
    """
    Tarea asíncrona para generar reporte diario de ventas
    """
    from sportcore_app.models import Pedido
    from datetime import datetime, timedelta
    
    try:
        yesterday = datetime.now().date() - timedelta(days=1)
        pedidos = Pedido.objects.filter(fecha__date=yesterday)
        
        total_sales = sum(pedido.total for pedido in pedidos)
        total_orders = pedidos.count()
        
        logger.info(f'Daily report generated: {total_orders} orders, ${total_sales} total')
        
        return {
            'date': str(yesterday),
            'total_orders': total_orders,
            'total_sales': float(total_sales),
        }
    except Exception as e:
        logger.error(f'Failed to generate daily report: {str(e)}')
        return None

@shared_task
def update_product_stock(producto_id, cantidad):
    """
    Tarea asíncrona para actualizar stock de producto
    """
    from sportcore_app.models import Producto
    
    try:
        producto = Producto.objects.get(id=producto_id)
        producto.stock -= cantidad
        producto.save()
        logger.info(f'Stock updated for product #{producto_id}: {producto.stock} remaining')
    except Exception as e:
        logger.error(f'Failed to update stock for product #{producto_id}: {str(e)}')

@shared_task
def process_low_stock_notification():
    """
    Tarea programada para notificar productos con bajo stock
    """
    from sportcore_app.models import Producto
    
    try:
        low_stock_products = Producto.objects.filter(stock__lt=5)
        
        for producto in low_stock_products:
            logger.warning(f'Low stock alert: Product #{producto.id} - {producto.nombre} has {producto.stock} units')
        
        return {
            'low_stock_count': low_stock_products.count(),
            'products': [{'id': p.id, 'name': p.nombre, 'stock': p.stock} for p in low_stock_products]
        }
    except Exception as e:
        logger.error(f'Failed to process low stock notification: {str(e)}')
        return None
