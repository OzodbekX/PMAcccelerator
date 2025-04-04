import { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{weatherData.location}</h2>
      <div className="flex items-center">
        <img 
          src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
          alt={weatherData.description}
          className="w-16 h-16"
        />
        <span className="text-4xl font-bold">{Math.round(weatherData.temp)}°C</span>
      </div>
      <p className="text-gray-600 capitalize">{weatherData.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Wind: {weatherData.windSpeed} km/h</p>
        <p>Feels like: {Math.round(weatherData.feelsLike)}°C</p>
        <p>Pressure: {weatherData.pressure} hPa</p>
      </div>
    </div>
  );
};

export default WeatherCard;