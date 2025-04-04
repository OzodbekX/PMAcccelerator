export interface WeatherData {
    location: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    pressure: number;
    lon?: number;
    lat?: number;
  }
  
  export interface LocationOption {
    id: number;
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  }