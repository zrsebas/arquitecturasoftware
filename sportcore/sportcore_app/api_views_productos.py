from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producto
from .serializers import ProductoSerializer


class ProductoAPIView(APIView):
    """
    APIView para productos
    """
    
    def get(self, request):
        """
        GET /api/productos/ - Listar todos los productos
        """
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        POST /api/productos/ - Crear nuevo producto
        """
        serializer = ProductoSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {"error": "Datos inválidos", "details": serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
