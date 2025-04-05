from rest_framework import serializers
from .models import Location, WeatherData

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'country', 'state', 'lat', 'lon']

class WeatherDataSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    class Meta:
        model = WeatherData
        fields = [
            'location', 'temp', 'feels_like', 'humidity',
            'wind_speed', 'description', 'icon', 'pressure', 'timestamp'
        ]