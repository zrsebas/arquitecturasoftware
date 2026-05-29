from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente
from .serializers import ClienteSerializer


class ClienteAPIView(APIView):
    """
    APIView para clientes
    """
    
    def get(self, request):
        """
        GET /api/clientes/ - Listar todos los clientes
        """
        clientes = Cliente.objects.all()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        POST /api/clientes/ - Crear nuevo cliente
        """
        serializer = ClienteSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {"error": "Datos inválidos", "details": serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
