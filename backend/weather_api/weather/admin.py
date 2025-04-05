from django.contrib import admin
from .models import Location, WeatherData

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'lat', 'lon')
    search_fields = ('name', 'country')

@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ('location', 'temp', 'description', 'timestamp')
    list_filter = ('timestamp',)