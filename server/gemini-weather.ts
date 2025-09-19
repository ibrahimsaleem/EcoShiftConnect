import { GoogleGenerativeAI } from "@google/generative-ai";

// This API key is from Gemini Developer API Key
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

interface EcoBand {
  hour: number;
  band: string;
  price: number;
  credit: number;
  points: number;
  description: string;
}

interface ACRecommendation {
  suggestedTemp: number;
  reasoning: string;
  savings: number;
  comfort: string;
  nextHourTemp: number;
  nextHourRecommendation: string;
}

export async function generateWeatherACRecommendation(
  weather: WeatherData,
  ecoBands: EcoBand[],
  currentBand: EcoBand
): Promise<ACRecommendation> {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not found, using fallback AC recommendation');
      return getFallbackACRecommendation(weather, currentBand);
    }

    const systemPrompt = `You are EcoShift, an AI energy advisor that provides smart AC temperature recommendations based on weather conditions and electricity pricing.

Your task is to:
1. Analyze current weather conditions (temperature, humidity, wind, visibility)
2. Consider current electricity pricing and energy band status
3. Recommend optimal AC temperature for comfort and energy savings
4. Predict next hour's weather and provide forward-looking advice
5. Calculate potential savings from following the recommendation

Your recommendations should:
- Prioritize comfort while maximizing energy savings
- Consider peak vs. off-peak electricity pricing
- Account for humidity levels and heat index
- Provide practical, actionable advice
- Include specific temperature settings

Return your response in this exact JSON format:
{
  "suggestedTemp": 76,
  "reasoning": "With 85°F outside and 60% humidity, setting AC to 76°F provides comfort while avoiding peak pricing penalties. The moderate humidity makes this temperature feel comfortable.",
  "savings": 0.15,
  "comfort": "Comfortable with good airflow",
  "nextHourTemp": 87,
  "nextHourRecommendation": "Temperature rising to 87°F - consider pre-cooling to 74°F now to avoid higher energy costs later."
}`;

    const userPrompt = `Analyze this weather data and provide AC temperature recommendations:

CURRENT WEATHER:
- City: ${weather.city}, ${weather.country}
- Temperature: ${weather.temperature}°F
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} mph
- Visibility: ${weather.visibility} miles
- Condition: ${weather.condition}
- Local Time: ${weather.localTime}

CURRENT ENERGY STATUS:
- Band: ${currentBand.band}
- Price: $${(currentBand.price/1000).toFixed(3)}/kWh
- Credit: $${currentBand.credit.toFixed(3)}
- Points: ${currentBand.points}
- Description: ${currentBand.description}

OPTIMIZATION RULES:
- GREEN hours: Optimal for AC usage, can set comfortable temperatures
- BLUE hours: Good for AC, moderate pricing
- ORANGE hours: Higher costs, consider raising temperature 2-3°F
- RED hours: Peak pricing, raise AC to 78°F+ or use fans instead

WEATHER CONSIDERATIONS:
- High humidity (>70%): Lower AC temperature for comfort
- High temperature (>90°F): Pre-cool during off-peak hours
- Wind: Can help with natural cooling
- Clear skies: Higher solar heat gain

Provide optimal AC temperature recommendation with reasoning and next hour forecast.`;

    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const response = await model.generateContent(userPrompt);
    const responseText = response.response.text() || "";
    
    console.log('Gemini Weather API response received:', responseText.substring(0, 200) + '...');
    
    try {
      // Try to parse the JSON response from Gemini
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.suggestedTemp && parsedResponse.reasoning) {
        return {
          suggestedTemp: parsedResponse.suggestedTemp,
          reasoning: parsedResponse.reasoning,
          savings: parsedResponse.savings || 0.10,
          comfort: parsedResponse.comfort || "Comfortable",
          nextHourTemp: parsedResponse.nextHourTemp || weather.temperature + 2,
          nextHourRecommendation: parsedResponse.nextHourRecommendation || "Monitor temperature changes"
        };
      } else {
        throw new Error("Invalid response format from Gemini");
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini weather response:', parseError);
      console.log('Raw Gemini response:', responseText);
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          if (extractedJson.suggestedTemp && extractedJson.reasoning) {
            return {
              suggestedTemp: extractedJson.suggestedTemp,
              reasoning: extractedJson.reasoning,
              savings: extractedJson.savings || 0.10,
              comfort: extractedJson.comfort || "Comfortable",
              nextHourTemp: extractedJson.nextHourTemp || weather.temperature + 2,
              nextHourRecommendation: extractedJson.nextHourRecommendation || "Monitor temperature changes"
            };
          }
        } catch (extractError) {
          console.error('Failed to extract JSON from response:', extractError);
        }
      }
      
      // Fallback: return a basic response
      return getFallbackACRecommendation(weather, currentBand);
    }
  } catch (error) {
    console.error('Failed to generate weather AC recommendation:', error);
    return getFallbackACRecommendation(weather, currentBand);
  }
}

function getFallbackACRecommendation(weather: WeatherData, currentBand: EcoBand): ACRecommendation {
  const isPeakTime = currentBand.band === 'RED' || currentBand.band === 'ORANGE';
  const isHot = weather.temperature > 85;
  const isHumid = weather.humidity > 70;
  
  let suggestedTemp = 76;
  let reasoning = "";
  let savings = 0.10;
  
  if (isPeakTime && isHot) {
    suggestedTemp = 78;
    reasoning = `Peak pricing (${currentBand.band} band) with hot weather (${weather.temperature}°F). Setting AC to 78°F saves money while maintaining comfort.`;
    savings = 0.20;
  } else if (isPeakTime) {
    suggestedTemp = 78;
    reasoning = `Peak pricing (${currentBand.band} band) - raise AC to 78°F to avoid high energy costs.`;
    savings = 0.15;
  } else if (isHot && isHumid) {
    suggestedTemp = 74;
    reasoning = `Hot and humid conditions (${weather.temperature}°F, ${weather.humidity}% humidity) - lower AC to 74°F for comfort during off-peak hours.`;
    savings = 0.05;
  } else if (isHot) {
    suggestedTemp = 76;
    reasoning = `Warm weather (${weather.temperature}°F) - comfortable AC setting at 76°F during off-peak hours.`;
    savings = 0.10;
  } else {
    suggestedTemp = 78;
    reasoning = `Moderate weather (${weather.temperature}°F) - energy-efficient AC setting at 78°F.`;
    savings = 0.15;
  }
  
  return {
    suggestedTemp,
    reasoning,
    savings,
    comfort: isHot && isHumid ? "Cool and dry" : isHot ? "Cool" : "Comfortable",
    nextHourTemp: weather.temperature + (Math.random() * 4 - 2), // ±2°F variation
    nextHourRecommendation: `Next hour forecast: ${Math.round(weather.temperature + 2)}°F. ${isPeakTime ? 'Consider pre-cooling now to avoid peak costs.' : 'Temperature stable, current setting should work well.'}`
  };
}
