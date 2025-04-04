import axios from 'axios';
import { WeatherData, LocationOption } from '../types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return {
      location: response.data.name,
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed * 3.6, // Convert from m/s to km/h
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      pressure: response.data.main.pressure,
      lon,
      lat,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const fetchWeatherByCity = async (cityId: number, cityName: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        id: cityId,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return {
      location: cityName,
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed * 3.6,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      pressure: response.data.main.pressure,
      lon: response.data.coord.lon,
      lat: response.data.coord.lat,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const searchLocations = async (query: string): Promise<LocationOption[]> => {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    return response.data.map((loc: any) => ({
      id: 0, // OpenWeather's direct geocoding doesn't provide ID, we'll generate one
      name: `${loc.name}, ${loc.country}`,
      country: loc.country,
      state: loc.state,
      lat: loc.lat,
      lon: loc.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};