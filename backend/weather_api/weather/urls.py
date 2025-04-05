from django.urls import path
from .views import (
    WeatherByCoordsAPIView,
    WeatherByCityAPIView,
    SearchLocationsAPIView
)

urlpatterns = [
    path('weather/by-coords/', WeatherByCoordsAPIView.as_view()),
    path('weather/by-city/', WeatherByCityAPIView.as_view()),
    path('search-locations/', SearchLocationsAPIView.as_view()),
]