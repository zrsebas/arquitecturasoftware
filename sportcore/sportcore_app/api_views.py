from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from .serializers import PedidoSerializer, PedidoCreateSerializer
from .models import Cliente, Producto, Pedido, DetallePedido
import json


@method_decorator(csrf_exempt, name='dispatch')
class PedidoAPIView(APIView):
    """
    APIView simple para pedidos
    """
    
    def dispatch(self, request, *args, **kwargs):
        print(f"DEBUG: PedidoAPIView.dispatch called - method: {request.method}")
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, pedido_id=None):
        """
        GET /api/pedidos/ - Listar todos los pedidos
        """
        if pedido_id:
            try:
                pedido = Pedido.objects.get(id=pedido_id)
                serializer = PedidoSerializer(pedido)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Pedido.DoesNotExist:
                return Response({"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            pedidos = Pedido.objects.all()
            serializer = PedidoSerializer(pedidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        POST /api/pedidos/ - Crear nuevo pedido
        """
        try:
            print(f"DEBUG: Request body: {request.body}")
            print(f"DEBUG: Request data: {request.data}")
            data = json.loads(request.body)
            cliente_id = data.get('cliente_id')
            items = data.get('items', [])
            
            print(f"DEBUG: cliente_id: {cliente_id}")
            print(f"DEBUG: items: {items}")
            
            if not cliente_id:
                return Response({"error": "cliente_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not items:
                return Response({"error": "items es requerido"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar cliente existe
            try:
                cliente = Cliente.objects.get(id=cliente_id)
            except Cliente.DoesNotExist:
                return Response({"error": "Cliente no encontrado"}, status=status.HTTP_404_NOT_FOUND)
            
            # Crear pedido
            pedido = Pedido.objects.create(
                cliente=cliente,
                estado='pendiente',
                total=0
            )
            
            print(f"DEBUG: Pedido creado con ID: {pedido.id}")
            
            # Crear detalles y calcular total
            total = 0
            for item in items:
                producto_id = item.get('producto_id')
                cantidad = item.get('cantidad', 1)
                
                print(f"DEBUG: Procesando item - producto_id: {producto_id}, cantidad: {cantidad}")
                
                try:
                    producto = Producto.objects.get(id=producto_id)
                except Producto.DoesNotExist:
                    return Response({"error": f"Producto {producto_id} no encontrado"}, status=status.HTTP_404_NOT_FOUND)
                
                subtotal = float(producto.precio) * cantidad
                total += subtotal
                
                DetallePedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=cantidad,
                    precio_unitario=producto.precio
                )
                
                print(f"DEBUG: Detalle creado - subtotal: {subtotal}")
            
            print(f"DEBUG: Total calculado: {total}")
            # Actualizar total del pedido
            pedido.total = total
            pedido.save()
            
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"DEBUG: Exception: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
