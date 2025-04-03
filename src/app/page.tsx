'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import LocationList from '../components/LocationList';
import { WeatherData, LocationOption } from '../types/weather';
import { fetchWeatherByCoords, fetchWeatherByCity, searchLocations } from '@/utils/weatherAPI';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch user's current location weather
  useEffect(() => {
    const fetchDefaultWeather = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const data = await fetchWeatherByCoords(latitude, longitude);
              setWeatherData(data);
              setLoading(false);
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Fallback to a default location if geolocation is denied
              fetchWeatherByCoords(51.5074, -0.1278).then((data) => {
                setWeatherData(data);
                setLoading(false);
              });
            }
          );
        } else {
          // Fallback if geolocation is not supported
          fetchWeatherByCoords(51.5074, -0.1278).then((data) => {
            setWeatherData(data);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error('Error fetching default weather:', error);
        toast.error('Failed to load weather data');
        setLoading(false);
      }
    };

    fetchDefaultWeather();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const results = await searchLocations(query);
      setSearchResults(results.map((loc, index) => ({ ...loc, id: index })));
      setShowSearchResults(true);
    } catch (error) {
      toast.error('Failed to search locations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (id: number, name: string) => {
    try {
      setLoading(true);
      setShowSearchResults(false);
      const data = await fetchWeatherByCity(id, name);
      setWeatherData(data);
    } catch (error) {
      toast.error('Failed to fetch weather for selected location');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-00">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-center">Weather Forecast</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {showSearchResults && (
          <LocationList 
            locations={searchResults} 
            onSelect={handleLocationSelect} 
          />
        )}
        
        {loading ? (
          <div className="text-center">
            <p>Loading weather data...</p>
          </div>
        ) : weatherData ? (
          <WeatherCard weatherData={weatherData} />
        ) : (
          <div className="text-center">
            <p>No weather data available</p>
          </div>
        )}
      </div>
    </div>
  );
}