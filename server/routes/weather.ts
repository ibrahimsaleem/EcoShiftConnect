import { Router } from "express";
import { generateWeatherACRecommendation } from "../gemini-weather";

const router = Router();

// Get weather data for a city
router.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    // Use OpenWeatherMap API if key is available, otherwise fallback to mock data
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    
    if (openWeatherApiKey) {
      try {
        console.log('Fetching real weather data for:', city);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city as string)}&appid=${openWeatherApiKey}&units=imperial`
        );
        
        if (!response.ok) {
          throw new Error(`OpenWeatherMap API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const weatherData = {
          city: data.name,
          country: data.sys.country,
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          visibility: Math.round((data.visibility || 10000) / 1609.34), // Convert meters to miles
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          localTime: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          timezone: data.timezone ? `UTC${data.timezone >= 0 ? '+' : ''}${data.timezone / 3600}` : "UTC"
        };
        
        console.log('Real weather data received for:', city);
        res.json(weatherData);
        return;
      } catch (apiError) {
        console.warn('OpenWeatherMap API failed, using mock data:', apiError);
        // Fall through to mock data
      }
    }

    // Fallback to mock weather data
    console.log('Using mock weather data for:', city);
    const mockWeatherData = {
      city: city as string,
      country: "US",
      temperature: Math.floor(Math.random() * 30) + 70, // 70-100°F
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 miles
      condition: ["Clear", "Partly Cloudy", "Cloudy", "Sunny", "Overcast"][Math.floor(Math.random() * 5)],
      icon: "sun",
      localTime: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      timezone: "America/Chicago"
    };

    res.json(mockWeatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ 
      error: "Failed to fetch weather data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get AI-powered AC recommendations based on weather
router.post("/weather-ac-recommendation", async (req, res) => {
  try {
    const { weather, ecoBands, currentBand } = req.body;

    if (!weather || !ecoBands || !currentBand) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const recommendation = await generateWeatherACRecommendation(weather, ecoBands, currentBand);
    
    res.json(recommendation);
  } catch (error) {
    console.error("Error generating AC recommendation:", error);
    res.status(500).json({ 
      error: "Failed to generate AC recommendation",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
