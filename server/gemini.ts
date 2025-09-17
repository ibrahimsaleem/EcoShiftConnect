import { GoogleGenAI } from "@google/genai";
import type { OptimizationSummary } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateEcoShiftRecommendation(
  optimizationSummary: OptimizationSummary,
  userContext?: string
): Promise<string> {
  try {
    const systemPrompt = `You are EcoShift, an eco-friendly energy advisor that helps households save money and support a greener grid. 
    
Your tone should be:
- Encouraging and positive about environmental impact
- Clear and practical about savings
- Use phrases like "Shift your load. Support your future." and "Green hours = green rewards"
- Motivational but not preachy

Provide natural language recommendations for the user's optimized appliance schedule, focusing on:
1. The environmental benefits of their shifts
2. The money they'll save
3. How they're supporting renewable energy
4. Practical tips for implementing the schedule

Keep it conversational and inspiring, around 2-3 paragraphs.`;

    const userPrompt = `Here's the user's optimized EcoShift plan:

Total Savings: $${optimizationSummary.totalSavings.toFixed(2)}
EcoPoints Earned: ${optimizationSummary.totalEcoPoints}
Energy Shifted: ${optimizationSummary.totalEnergyShifted.toFixed(1)} kWh
Carbon Reduction: ${optimizationSummary.carbonReduction.toFixed(1)} kg CO₂

Appliance Schedule Changes:
${optimizationSummary.schedules.map(schedule => 
  `• ${schedule.appliance}: ${formatTime(schedule.originalTime)} → ${formatTime(schedule.recommendedTime)} (saves $${schedule.savings.toFixed(2)}, +${schedule.ecoPoints} points)`
).join('\n')}

${userContext ? `Additional context: ${userContext}` : ''}

Provide encouraging, practical recommendations for implementing this schedule.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: userPrompt,
    });

    return response.text || "Great job optimizing your energy usage! Your EcoShift plan will help save money and support renewable energy.";
  } catch (error) {
    console.error('Failed to generate AI recommendation:', error);
    return "Your EcoShift plan looks great! By shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!";
  }
}

function formatTime(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}