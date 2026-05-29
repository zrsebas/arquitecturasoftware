"""
Adapter Pattern Implementation for Third-Party APIs
This follows the Dependency Inversion Principle
"""
from abc import ABC, abstractmethod
import requests
from typing import Dict, Any, List


class ExternalAPIClient(ABC):
    """
    Abstract base class for external API clients
    This is the abstraction that our code depends on
    """
    
    @abstractmethod
    def fetch_data(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Fetch data from the external API"""
        pass
    
    @abstractmethod
    def post_data(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Post data to the external API"""
        pass


class JSONPlaceholderAdapter(ExternalAPIClient):
    """
    Adapter for JSONPlaceholder API (Example Third-Party API)
    https://jsonplaceholder.typicode.com/
    """
    
    def __init__(self, base_url: str = "https://jsonplaceholder.typicode.com"):
        self.base_url = base_url
    
    def fetch_data(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Fetch data from JSONPlaceholder"""
        url = f"{self.base_url}/{endpoint}"
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {
                'error': str(e),
                'status': 'failed'
            }
    
    def post_data(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Post data to JSONPlaceholder"""
        url = f"{self.base_url}/{endpoint}"
        try:
            response = requests.post(url, json=data, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {
                'error': str(e),
                'status': 'failed'
            }


class WeatherAPIAdapter(ExternalAPIClient):
    """
    Adapter for Weather API (Example Third-Party API)
    Using Open-Meteo API (free, no API key required)
    """
    
    def __init__(self, base_url: str = "https://api.open-meteo.com/v1"):
        self.base_url = base_url
    
    def fetch_data(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Fetch weather data from Open-Meteo"""
        url = f"{self.base_url}/{endpoint}"
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {
                'error': str(e),
                'status': 'failed'
            }
    
    def post_data(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Open-Meteo doesn't support POST, return error"""
        return {
            'error': 'POST not supported by this API',
            'status': 'failed'
        }


class ExternalAPIService:
    """
    Service class that uses the adapters
    This demonstrates Dependency Inversion:
    The service depends on the abstraction (ExternalAPIClient)
    not on concrete implementations
    """
    
    def __init__(self, adapter: ExternalAPIClient):
        self.adapter = adapter
    
    def get_users(self) -> List[Dict[str, Any]]:
        """Get users from the external API"""
        return self.adapter.fetch_data('users')
    
    def get_posts(self) -> List[Dict[str, Any]]:
        """Get posts from the external API"""
        return self.adapter.fetch_data('posts')
    
    def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Get weather data"""
        params = {
            'latitude': lat,
            'longitude': lon,
            'current_weather': 'true'
        }
        return self.adapter.fetch_data('forecast', params)


# Factory function to create adapters
def create_adapter(adapter_type: str) -> ExternalAPIClient:
    """
    Factory function to create the appropriate adapter
    This follows the Factory Pattern
    """
    adapters = {
        'jsonplaceholder': JSONPlaceholderAdapter(),
        'weather': WeatherAPIAdapter(),
    }
    
    if adapter_type.lower() not in adapters:
        raise ValueError(f"Unknown adapter type: {adapter_type}")
    
    return adapters[adapter_type.lower()]
