"""
Views for consuming ally team's service
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import requests
from typing import Dict, Any


# Configuration for ally team's service
ALLY_SERVICE_URL = "https://jsonplaceholder.typicode.com"  # Example URL
# Replace with actual ally team's service URL


@require_http_methods(["GET"])
def ally_service_proxy(request, endpoint: str):
    """
    Proxy to consume ally team's service
    This demonstrates consuming a service from an allied team
    Endpoint: /api/ally/<endpoint>
    """
    try:
        # Construct the full URL to the ally's service
        url = f"{ALLY_SERVICE_URL}/{endpoint}"
        
        # Forward query parameters
        params = request.GET.dict()
        
        # Make the request to the ally's service
        response = requests.get(url, params=params, timeout=10)
        
        # Return the response from the ally's service
        return JsonResponse(
            response.json(),
            status=response.status_code,
            safe=False
        )
    except requests.RequestException as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Failed to consume ally service: {str(e)}',
            'ally_service': ALLY_SERVICE_URL
        }, status=503)


@require_http_methods(["GET"])
def ally_users(request):
    """
    Consume ally's users endpoint
    Endpoint: /api/ally/users
    """
    try:
        url = f"{ALLY_SERVICE_URL}/users"
        response = requests.get(url, timeout=10)
        
        users_data = response.json()
        
        # Transform the data if needed
        transformed_users = []
        for user in users_data:
            transformed_users.append({
                'id': user.get('id'),
                'name': user.get('name'),
                'email': user.get('email'),
                'company': user.get('company', {}).get('name') if user.get('company') else None,
                'source': 'ally_service'
            })
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'count': len(transformed_users),
                'users': transformed_users,
                'source': ALLY_SERVICE_URL
            }
        })
    except requests.RequestException as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=503)


@require_http_methods(["GET"])
def ally_posts(request):
    """
    Consume ally's posts endpoint
    Endpoint: /api/ally/posts
    """
    try:
        url = f"{ALLY_SERVICE_URL}/posts"
        response = requests.get(url, timeout=10)
        
        posts_data = response.json()
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'count': len(posts_data),
                'posts': posts_data,
                'source': ALLY_SERVICE_URL
            }
        })
    except requests.RequestException as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=503)


@require_http_methods(["GET"])
def integrated_dashboard(request):
    """
    Integrated dashboard showing our data + ally's data
    Endpoint: /api/integrated/dashboard
    """
    try:
        # Get our internal stats
        from sportcore_app.models import Pedido, Producto, Cliente
        
        our_stats = {
            'total_orders': Pedido.objects.count(),
            'total_products': Producto.objects.count(),
            'total_clients': Cliente.objects.count(),
        }
        
        # Get ally's data
        ally_users_response = requests.get(f"{ALLY_SERVICE_URL}/users", timeout=10)
        ally_users = ally_users_response.json()
        
        ally_posts_response = requests.get(f"{ALLY_SERVICE_URL}/posts", timeout=10)
        ally_posts = ally_posts_response.json()
        
        ally_stats = {
            'total_users': len(ally_users),
            'total_posts': len(ally_posts),
        }
        
        return JsonResponse({
            'status': 'success',
            'data': {
                'our_system': our_stats,
                'ally_system': ally_stats,
                'integration': 'successful'
            }
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
