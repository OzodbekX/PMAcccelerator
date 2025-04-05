from django.db import models

# Create your models here.
from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lon = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}, {self.country}"

class WeatherData(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='weather_data')
    temp = models.DecimalField(max_digits=5, decimal_places=2)
    feels_like = models.DecimalField(max_digits=5, decimal_places=2)
    humidity = models.IntegerField()
    wind_speed = models.DecimalField(max_digits=5, decimal_places=2)  # km/h
    description = models.CharField(max_length=100)
    icon = models.CharField(max_length=10)
    pressure = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.location.name} - {self.temp}°C"