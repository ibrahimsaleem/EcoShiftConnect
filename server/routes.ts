import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { EcoShiftOptimizer } from "./optimization";
import { generateEcoShiftRecommendation } from "./gemini";
import { 
  optimizationRequestSchema, 
  aiRecommendationRequestSchema,
  enhancedAIRecommendationRequestSchema 
} from "@shared/schema";
import { generateWeatherACRecommendation } from "./gemini-weather";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  const optimizer = new EcoShiftOptimizer();
  
  // Health check endpoint for Render
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get eco bands data
  app.get("/api/eco-bands", (req, res) => {
    try {
      const ecoBands = optimizer.getEcoBands();
      res.json(ecoBands);
    } catch (error) {
      console.error("Error fetching eco bands:", error);
      res.status(500).json({ error: "Failed to fetch eco bands data" });
    }
  });

  // Optimize appliance schedule
  app.post("/api/optimize", async (req, res) => {
    try {
      const validatedRequest = optimizationRequestSchema.parse(req.body);
      const optimizationResult = optimizer.optimizeAppliances(
        validatedRequest.appliances,
        validatedRequest.preferences
      );
      
      // Store result for potential future reference
      const resultId = randomUUID();
      await storage.storeOptimizationResult(resultId, optimizationResult);
      
      res.json({
        id: resultId,
        ...optimizationResult
      });
    } catch (error) {
      console.error("Error optimizing appliances:", error);
      res.status(400).json({ 
        error: "Failed to optimize appliances",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get AI-powered recommendation (legacy)
  app.post("/api/recommend", async (req, res) => {
    try {
      const validatedRequest = aiRecommendationRequestSchema.parse(req.body);
      const recommendation = await generateEcoShiftRecommendation(
        validatedRequest.optimizationSummary,
        validatedRequest.userContext
      );
      
      res.json({ recommendation });
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      res.status(500).json({ 
        error: "Failed to generate recommendation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get enhanced AI-powered recommendation with optimization
  app.post("/api/recommend-enhanced", async (req, res) => {
    try {
      const validatedRequest = enhancedAIRecommendationRequestSchema.parse(req.body);
      const result = await generateEcoShiftRecommendation(
        validatedRequest.appliances,
        validatedRequest.ecoBands,
        validatedRequest.userContext
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error generating enhanced AI recommendation:", error);
      res.status(500).json({ 
        error: "Failed to generate enhanced recommendation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Export optimization result
  app.post("/api/export", async (req, res) => {
    try {
      const { format = 'json', optimizationSummary } = req.body;
      
      if (!optimizationSummary) {
        return res.status(400).json({ error: "Optimization summary required" });
      }

      const date = new Date().toISOString().split('T')[0];
      
      if (format === 'csv') {
        let csv = "Appliance,Original Time,Recommended Time,Savings ($),EcoPoints\n";
        optimizationSummary.schedules.forEach((schedule: any) => {
          const formatTime = (hour: number) => {
            if (hour === 0) return "12:00 AM";
            if (hour < 12) return `${hour}:00 AM`;
            if (hour === 12) return "12:00 PM";
            return `${hour - 12}:00 PM`;
          };
          
          csv += `"${schedule.appliance}","${formatTime(schedule.originalTime)}","${formatTime(schedule.recommendedTime)}",${schedule.savings.toFixed(2)},${schedule.ecoPoints}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=ecoshift-plan-${date}.csv`);
        res.send(csv);
      } else if (format === 'text') {
        const formatTime = (hour: number) => {
          if (hour === 0) return "12:00 AM";
          if (hour < 12) return `${hour}:00 AM`;
          if (hour === 12) return "12:00 PM";
          return `${hour - 12}:00 PM`;
        };
        
        let summary = `🌱 EcoShift Plan - ${new Date().toLocaleDateString()}\n\n`;
        summary += `💰 Total Savings: $${optimizationSummary.totalSavings.toFixed(2)}\n`;
        summary += `🍃 EcoPoints Earned: +${optimizationSummary.totalEcoPoints}\n\n`;
        summary += `📅 Recommended Schedule:\n`;
        
        optimizationSummary.schedules.forEach((schedule: any) => {
          summary += `• ${schedule.appliance}: ${formatTime(schedule.originalTime)} → ${formatTime(schedule.recommendedTime)} (+$${schedule.savings.toFixed(2)}, +${schedule.ecoPoints} pts)\n`;
        });
        
        summary += `\nBy shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!\n\n`;
        summary += `Generated by EcoShift - Power Your Savings, Protect Our Planet`;
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=ecoshift-plan-${date}.txt`);
        res.send(summary);
      } else {
        // JSON format
        const exportData = {
          exportDate: new Date().toISOString(),
          ...optimizationSummary
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=ecoshift-plan-${date}.json`);
        res.json(exportData);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ 
        error: "Failed to export data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "EcoShift API"
    });
  });

  // Weather routes
  // Get weather data for a city
  app.get("/api/weather", async (req, res) => {
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
  app.post("/api/weather-ac-recommendation", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}