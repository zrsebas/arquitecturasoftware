from django.http import HttpResponse, JsonResponse
import os


def serve_frontend(request):
    """
    Serve the React frontend
    """
    try:
        # Serve the index.html directly from the dist folder
        frontend_dist = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
        index_path = os.path.join(frontend_dist, 'index.html')
        
        if os.path.exists(index_path):
            with open(index_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return HttpResponse(content, content_type='text/html')
        else:
            return JsonResponse({
                'error': 'Frontend not built. Run npm run build in frontend directory.',
                'frontend_dist': frontend_dist,
                'index_path': index_path
            }, status=503)
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'traceback': str(e.__traceback__) if hasattr(e, '__traceback__') else None
        }, status=500)
