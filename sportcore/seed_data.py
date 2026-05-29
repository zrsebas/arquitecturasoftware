import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sportcore_app.models import Cliente, Categoria, Producto

# Crear categorías
categorias_data = [
    {'nombre': 'Fútbol'},
    {'nombre': 'Ropa'},
    {'nombre': 'Calzado'},
    {'nombre': 'Boxeo'},
    {'nombre': 'Fitness'},
]

for cat_data in categorias_data:
    categoria, created = Categoria.objects.get_or_create(
        nombre=cat_data['nombre']
    )
    if created:
        print(f"Categoría creada: {categoria.nombre}")

# Crear clientes
clientes_data = [
    {'nombre': 'Juan Pérez', 'correo': 'juan.perez@email.com', 'direccion': 'Calle 123 #45'},
    {'nombre': 'María García', 'correo': 'maria.garcia@email.com', 'direccion': 'Avenida 67 #89'},
    {'nombre': 'Carlos López', 'correo': 'carlos.lopez@email.com', 'direccion': 'Carrera 45 #12'},
    {'nombre': 'Ana Martínez', 'correo': 'ana.martinez@email.com', 'direccion': 'Calle 78 #90'},
    {'nombre': 'Pedro Sánchez', 'correo': 'pedro.sanchez@email.com', 'direccion': 'Avenida 23 #45'},
]

for cliente_data in clientes_data:
    cliente, created = Cliente.objects.get_or_create(
        correo=cliente_data['correo'],
        defaults=cliente_data
    )
    if created:
        print(f"Cliente creado: {cliente.nombre}")

# Crear productos
productos_data = [
    {'nombre': 'Balón Profesional', 'precio': 29.99, 'descripcion': 'Balón de alta calidad profesional', 'categoria': 'Fútbol'},
    {'nombre': 'Camiseta Deportiva', 'precio': 49.99, 'descripcion': 'Camiseta transpirable para deporte', 'categoria': 'Ropa'},
    {'nombre': 'Zapatillas Running', 'precio': 89.99, 'descripcion': 'Zapatillas ligeras para correr', 'categoria': 'Calzado'},
    {'nombre': 'Guantes de Boxeo', 'precio': 39.99, 'descripcion': 'Guantes profesionales de boxeo', 'categoria': 'Boxeo'},
    {'nombre': 'Mancuernas 5kg', 'precio': 24.99, 'descripcion': 'Par de mancuernas de 5kg', 'categoria': 'Fitness'},
    {'nombre': 'Botines Fútbol', 'precio': 79.99, 'descripcion': 'Botines profesionales para césped', 'categoria': 'Calzado'},
    {'nombre': 'Short Deportivo', 'precio': 34.99, 'descripcion': 'Short cómodo para ejercicio', 'categoria': 'Ropa'},
    {'nombre': 'Saco de Boxeo', 'precio': 149.99, 'descripcion': 'Saco profesional de boxeo', 'categoria': 'Boxeo'},
]

for prod_data in productos_data:
    categoria = Categoria.objects.get(nombre=prod_data['categoria'])
    producto, created = Producto.objects.get_or_create(
        nombre=prod_data['nombre'],
        defaults={
            'descripcion': prod_data['descripcion'],
            'precio': prod_data['precio'],
            'categoria': categoria
        }
    )
    if created:
        print(f"Producto creado: {producto.nombre}")

print("\n✅ Datos de ejemplo creados exitosamente!")
