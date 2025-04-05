import os
import requests
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Location, WeatherData
from .serializers import WeatherDataSerializer, LocationSerializer

OWM_API_KEY = os.getenv('OWM_API_KEY')
BASE_URL = 'https://api.openweathermap.org/data/2.5'
GEO_URL = 'https://api.openweathermap.org/geo/1.0'


class WeatherByCoordsAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]  # GET = public, POST/PUT/DELETE = requires auth

    def get(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')

        if not lat or not lon:
            return Response(
                {"error": "Latitude and longitude are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch from OpenWeatherMap
            response = requests.get(f"{BASE_URL}/weather", params={
                'lat': lat,
                'lon': lon,
                'appid': OWM_API_KEY,
                'units': 'metric'
            })

            if response.status_code == 200:
                data = response.json()

                # Save to database
                location, _ = Location.objects.get_or_create(
                    name=data.get('name', 'Unknown'),
                    country=data.get('sys', {}).get('country', ''),
                    lat=data['coord']['lat'],
                    lon=data['coord']['lon']
                )

                weather_data = WeatherData.objects.create(
                    location=location,
                    temp=data['main']['temp'],
                    feels_like=data['main']['feels_like'],
                    humidity=data['main']['humidity'],
                    wind_speed=data['wind']['speed'] * 3.6,  # Convert to km/h
                    description=data['weather'][0]['description'],
                    icon=data['weather'][0]['icon'],
                    pressure=data['main']['pressure']
                )

                serializer = WeatherDataSerializer(weather_data)
                return Response(serializer.data)

            return Response(
                {"error": "Failed to fetch weather data"},
                status=response.status_code
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WeatherByCityAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]  # GET = public, POST/PUT/DELETE = requires auth
    def get(self, request):
        city_id = request.query_params.get('id')
        city_name = request.query_params.get('name')

        if not city_id and not city_name:
            return Response(
                {"error": "Either city ID or name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            params = {'appid': OWM_API_KEY, 'units': 'metric'}
            if city_id:
                params['id'] = city_id
            else:
                params['q'] = city_name

            response = requests.get(f"{BASE_URL}/weather", params=params)

            if response.status_code == 200:
                data = response.json()

                location, _ = Location.objects.get_or_create(
                    name=data.get('name', city_name or 'Unknown'),
                    country=data.get('sys', {}).get('country', ''),
                    lat=data['coord']['lat'],
                    lon=data['coord']['lon']
                )

                weather_data = WeatherData.objects.create(
                    location=location,
                    temp=data['main']['temp'],
                    feels_like=data['main']['feels_like'],
                    humidity=data['main']['humidity'],
                    wind_speed=data['wind']['speed'] * 3.6,
                    description=data['weather'][0]['description'],
                    icon=data['weather'][0]['icon'],
                    pressure=data['main']['pressure']
                )

                serializer = WeatherDataSerializer(weather_data)
                return Response(serializer.data)

            return Response(
                {"error": "Failed to fetch weather data"},
                status=response.status_code
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SearchLocationsAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]  # GET = public, POST/PUT/DELETE = requires auth

    def get(self, request):
        query = request.query_params.get('q')

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            response = requests.get(f"{GEO_URL}/direct", params={
                'q': query,
                'limit': 5,
                'appid': OWM_API_KEY
            })

            if response.status_code == 200:
                locations = []
                for loc in response.json():
                    locations.append({
                        'id': 0,  # Temporary ID for new locations
                        'name': f"{loc['name']}, {loc.get('country', '')}",
                        'country': loc.get('country', ''),
                        'state': loc.get('state', ''),
                        'lat': loc['lat'],
                        'lon': loc['lon']
                    })

                return Response(locations)

            return Response(
                {"error": "Failed to search locations"},
                status=response.status_code
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


from django.shortcuts import render

# Create your views here.
