import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Thermometer, 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind,
  Droplets,
  Eye,
  Clock,
  Zap,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import type { EcoBand } from "@shared/schema";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string;
  icon: string;
  localTime: string;
  timezone: string;
}

interface ACRecommendation {
  suggestedTemp: number;
  reasoning: string;
  savings: number;
  comfort: string;
  nextHourTemp: number;
  nextHourRecommendation: string;
}

interface WeatherOptimizerProps {
  ecoBands: EcoBand[];
}

export default function WeatherOptimizer({ ecoBands }: WeatherOptimizerProps) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [acRecommendation, setAcRecommendation] = useState<ACRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current hour's eco band data
  const currentHour = new Date().getHours();
  const currentBand = ecoBands.find(band => band.hour === currentHour) || ecoBands[0];
  const isPeakTime = currentBand.band === 'RED' || currentBand.band === 'ORANGE';

  const fetchWeather = async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching weather for city:', cityName);
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      
      console.log('Weather API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Weather API error response:', errorText);
        throw new Error(`Weather API error: ${response.status} - ${errorText.substring(0, 100)}`);
      }
      
      const data = await response.json();
      console.log('Weather data received:', data);
      setWeather(data);
      
      // Get AC recommendations
      await getACRecommendations(data);
      
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getACRecommendations = async (weatherData: WeatherData) => {
    try {
      console.log('Getting AC recommendations for:', weatherData.city);
      const response = await fetch('/api/weather-ac-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weather: weatherData,
          ecoBands: ecoBands,
          currentBand: currentBand
        }),
      });

      console.log('AC recommendation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AC recommendation error response:', errorText);
        throw new Error(`AC recommendation error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const recommendation = await response.json();
      console.log('AC recommendation received:', recommendation);
      setAcRecommendation(recommendation);
    } catch (err) {
      console.error('Failed to get AC recommendations:', err);
      // Set a fallback recommendation
      setAcRecommendation({
        suggestedTemp: 76,
        reasoning: "Based on current weather conditions and energy pricing, 76°F provides good comfort and energy efficiency.",
        savings: 0.10,
        comfort: "Comfortable",
        nextHourTemp: weatherData.temperature + 2,
        nextHourRecommendation: "Monitor temperature changes and adjust as needed."
      });
    }
  };

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (conditionLower.includes('cloud')) return <Cloud className="w-6 h-6 text-gray-500" />;
    if (conditionLower.includes('rain')) return <CloudRain className="w-6 h-6 text-blue-500" />;
    return <Cloud className="w-6 h-6 text-gray-500" />;
  };

  const getComfortLevel = (temp: number, humidity: number) => {
    if (temp > 85 && humidity > 70) return { level: 'Hot & Humid', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
    if (temp > 80 && humidity > 60) return { level: 'Warm & Sticky', color: 'text-orange-600', icon: <Thermometer className="w-4 h-4" /> };
    if (temp > 75) return { level: 'Warm', color: 'text-yellow-600', icon: <Sun className="w-4 h-4" /> };
    if (temp > 65) return { level: 'Comfortable', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
    return { level: 'Cool', color: 'text-blue-600', icon: <Cloud className="w-4 h-4" /> };
  };

  const getACIcon = (temp: number) => {
    if (temp >= 78) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (temp >= 75) return <Thermometer className="w-5 h-5 text-orange-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Weather-Based Energy Optimization</h1>
        <p className="text-muted-foreground text-lg">
          Get AI-powered AC temperature recommendations based on your local weather and energy pricing
        </p>
      </div>

      {/* City Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Select Your City</h2>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="city-input">City Name</Label>
              <Input
                id="city-input"
                placeholder="Enter city name (e.g., Houston, New York, London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && city && fetchWeather(city)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => city && fetchWeather(city)}
                disabled={!city || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Weather
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Weather Display */}
      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Weather */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(weather.condition)}
                <div>
                  <h3 className="text-lg font-semibold">{weather.city}, {weather.country}</h3>
                  <p className="text-sm text-muted-foreground">{weather.condition}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {weather.localTime}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Temperature</span>
                </div>
                <p className="text-2xl font-bold">{weather.temperature}°F</p>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Droplets className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Humidity</span>
                </div>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Wind className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Wind</span>
                </div>
                <p className="text-2xl font-bold">{weather.windSpeed} mph</p>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Visibility</span>
                </div>
                <p className="text-2xl font-bold">{weather.visibility} mi</p>
              </div>
            </div>

            {/* Comfort Level */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium">Comfort Level:</span>
                {getComfortLevel(weather.temperature, weather.humidity).icon}
              </div>
              <p className={`font-medium ${getComfortLevel(weather.temperature, weather.humidity).color}`}>
                {getComfortLevel(weather.temperature, weather.humidity).level}
              </p>
            </div>
          </Card>

          {/* AC Recommendations */}
          {acRecommendation && (
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">AI AC Recommendations</h3>
              </div>

              {/* Current Recommendation */}
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Recommended AC Temperature</span>
                    {getACIcon(acRecommendation.suggestedTemp)}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {acRecommendation.suggestedTemp}°F
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {acRecommendation.reasoning}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span>Save: ${acRecommendation.savings.toFixed(2)}/hour</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Thermometer className="w-4 h-4 text-blue-600" />
                      <span>{acRecommendation.comfort}</span>
                    </div>
                  </div>
                </div>

                {/* Next Hour Prediction */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Next Hour Forecast</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Temperature: {acRecommendation.nextHourTemp}°F
                  </p>
                  <p className="text-sm text-blue-700">
                    {acRecommendation.nextHourRecommendation}
                  </p>
                </div>

                {/* Energy Band Status */}
                <div className={`p-4 rounded-lg border-2 ${
                  isPeakTime ? 'bg-red-50 border-red-200' : 
                  currentBand.band === 'GREEN' ? 'bg-green-50 border-green-200' : 
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isPeakTime ? <AlertTriangle className="w-4 h-4 text-red-600" /> : 
                     currentBand.band === 'GREEN' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     <Clock className="w-4 h-4 text-blue-600" />}
                    <span className={`font-medium ${
                      isPeakTime ? 'text-red-800' : 
                      currentBand.band === 'GREEN' ? 'text-green-800' : 
                      'text-blue-800'
                    }`}>
                      Current Energy Status: {currentBand.band} Band
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isPeakTime ? 'text-red-700' : 
                    currentBand.band === 'GREEN' ? 'text-green-700' : 
                    'text-blue-700'
                  }`}>
                    {isPeakTime ? 
                      'Peak pricing - Consider raising AC to 78°F+ to save money' :
                      currentBand.band === 'GREEN' ? 
                      'Optimal pricing - You can use AC comfortably' :
                      'Moderate pricing - Standard AC usage is fine'
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Quick City Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Select Cities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Houston', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Phoenix', 'Denver', 'Seattle'].map((cityName) => (
            <Button
              key={cityName}
              variant="outline"
              size="sm"
              onClick={() => {
                setCity(cityName);
                fetchWeather(cityName);
              }}
              disabled={isLoading}
              className="justify-start"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {cityName}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
