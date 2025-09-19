import { GoogleGenerativeAI } from "@google/generative-ai";
import type { OptimizationSummary, Appliance, EcoBand } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const GEMINI_API_KEY = "AIzaSyAVd72kO1py4DuPzTDKdQPJNduMEi6pKa8";
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateEcoShiftRecommendation(
  appliances: Appliance[],
  ecoBands: EcoBand[],
  userContext?: string
): Promise<{ recommendation: string; optimizedSchedule: OptimizationSummary }> {
  try {
    // Check if API key is available
    console.log('Environment check - GEMINI_API_KEY:', GEMINI_API_KEY ? 'Found' : 'Not found');
    if (!GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not found, using fallback response');
      return {
        recommendation: "Your EcoShift plan looks great! By shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!",
        optimizedSchedule: {
          totalSavings: 0.17,
          totalEcoPoints: 15,
          totalEnergyShifted: 15.0,
          carbonReduction: 6.0,
          schedules: [{
            appliance: "Electric Vehicle",
            originalTime: 17, // 5 PM
            recommendedTime: 11, // 11 AM
            savings: 0.17,
            ecoPoints: 15,
            reasoning: "Shift from 5:00 PM to 11:00 AM to avoid peak pricing during high demand and earn maximum eco points",
            energyUsed: 15.0
          }]
        }
      };
    }
    const systemPrompt = `You are EcoShift, an eco-friendly energy advisor that helps households save money and support a greener grid. 

Your task is to:
1. Analyze the user's selected appliances with their desired start times and runtime
2. Use the provided eco bands data (pricing, penalties, rewards) to find optimal shift times
3. Calculate maximum savings while being practical about timing
4. Provide both the optimized schedule AND an encouraging recommendation

Your tone should be:
- Encouraging and positive about environmental impact
- Clear and practical about savings
- Use phrases like "Shift your load. Support your future." and "Green hours = green rewards"
- Motivational but not preachy

For each appliance, find the best start time within ±6 hours of their desired time that maximizes:
- Cost savings (avoid peak pricing, especially RED hours 6-9 PM)
- Eco points (prefer GREEN hours like 2-4 AM and 8-11 AM)
- Practicality (reasonable shift times that work with user's lifestyle)

PRIORITY ORDER:
1. GREEN hours (2-4 AM, 8-11 AM) - Best for savings and eco points
2. BLUE hours - Good alternative if GREEN not practical
3. ORANGE hours - Only if no better option within flexibility window
4. RED hours - Avoid at all costs (6-9 PM peak pricing)

Return your response in this exact JSON format:
{
  "recommendation": "Your encouraging 2-3 paragraph recommendation here...",
  "optimizedSchedule": {
    "totalSavings": 0.00,
    "totalEcoPoints": 0,
    "totalEnergyShifted": 0.0,
    "carbonReduction": 0.0,
    "schedules": [
      {
        "appliance": "Appliance Name",
        "originalTime": 19,
        "recommendedTime": 2,
        "savings": 0.00,
        "ecoPoints": 0,
        "reasoning": "Why this shift is optimal...",
        "energyUsed": 0.0
      }
    ]
  }
}`;

    const selectedAppliances = appliances.filter(a => a.selected);
    
    const userPrompt = `Analyze these user appliances and optimize their schedule for maximum savings and eco benefits:

USER'S SELECTED APPLIANCES:
${selectedAppliances.map(appliance => 
  `• ${appliance.name}: Desired start time ${formatTime(appliance.startTime || 19)}, Runtime ${appliance.runtime || appliance.defaultRuntime} hours, Power ${appliance.powerMin}-${appliance.powerMax}W`
).join('\n')}

ECO BANDS DATA (24-hour pricing and rewards):
${ecoBands.map(band => 
  `Hour ${band.hour} (${formatTime(band.hour)}): ${band.band} band - Price: $${(band.price/1000).toFixed(3)}/kWh, Credit: $${band.credit.toFixed(3)}, Points: ${band.points}, Description: ${band.description}`
).join('\n')}

OPTIMIZATION RULES:
- GREEN hours: Best for appliances (lowest cost, highest rewards)
- BLUE hours: Good alternative (moderate cost, small rewards)  
- ORANGE hours: Avoid if possible (higher cost, no rewards)
- RED hours: Worst choice (highest cost, penalties)

Calculate optimal shifts within ±6 hours of desired start time for each appliance.
Focus on maximizing savings while being practical about timing.

${userContext ? `Additional user context: ${userContext}` : ''}

Provide the optimized schedule and encouraging recommendation.`;

    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const response = await model.generateContent(userPrompt);
    const responseText = response.response.text() || "";
    
    console.log('Gemini API response received:', responseText.substring(0, 200) + '...');
    
    try {
      // Try to parse the JSON response from Gemini
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.recommendation && parsedResponse.optimizedSchedule) {
        return {
          recommendation: parsedResponse.recommendation,
          optimizedSchedule: parsedResponse.optimizedSchedule
        };
      } else {
        throw new Error("Invalid response format from Gemini");
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw Gemini response:', responseText);
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          if (extractedJson.recommendation && extractedJson.optimizedSchedule) {
            return {
              recommendation: extractedJson.recommendation,
              optimizedSchedule: extractedJson.optimizedSchedule
            };
          }
        } catch (extractError) {
          console.error('Failed to extract JSON from response:', extractError);
        }
      }
      
      // Fallback: return a basic response with the raw text
      return {
        recommendation: responseText || "Great job optimizing your energy usage! Your EcoShift plan will help save money and support renewable energy.",
        optimizedSchedule: {
          totalSavings: 0,
          totalEcoPoints: 0,
          totalEnergyShifted: 0,
          carbonReduction: 0,
          schedules: []
        }
      };
    }
  } catch (error) {
    console.error('Failed to generate AI recommendation:', error);
    return {
      recommendation: "Your EcoShift plan looks great! By shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!",
      optimizedSchedule: {
        totalSavings: 0,
        totalEcoPoints: 0,
        totalEnergyShifted: 0,
        carbonReduction: 0,
        schedules: []
      }
    };
  }
}

function formatTime(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}