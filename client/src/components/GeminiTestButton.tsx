import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import type { Appliance, EcoBand, OptimizationSummary } from "@shared/schema";

interface GeminiTestButtonProps {
  appliances: Appliance[];
  ecoBands: EcoBand[];
}

export default function GeminiTestButton({ appliances, ecoBands }: GeminiTestButtonProps) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [result, setResult] = useState<{
    recommendation: string;
    optimizedSchedule: OptimizationSummary;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Automatically trigger AI recommendations when component mounts
  useEffect(() => {
    testGeminiOptimization();
  }, []);

  const testGeminiOptimization = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/recommend-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appliances,
          ecoBands,
          userContext: "User wants to maximize savings while being practical about timing"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (hour: number): string => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {isLoading && (
        <Card className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <div>
              <h3 className="font-semibold text-lg">AI is analyzing your energy patterns...</h3>
              <p className="text-muted-foreground">
                Gemini AI is optimizing your schedule for maximum savings and eco benefits
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Retry Button (only show if there was an error) */}
      {error && (
        <Button 
          onClick={testGeminiOptimization} 
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Retry AI Optimization
        </Button>
      )}

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600 text-sm">
            Error: {error}
          </p>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          {/* AI Recommendation */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">AI Recommendation</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {result.recommendation}
            </p>
          </Card>

          {/* Optimization Results */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Optimized Schedule</h3>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${result.optimizedSchedule.totalSavings.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Savings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  +{result.optimizedSchedule.totalEcoPoints}
                </p>
                <p className="text-sm text-muted-foreground">Eco Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {result.optimizedSchedule.totalEnergyShifted.toFixed(1)} kWh
                </p>
                <p className="text-sm text-muted-foreground">Energy Shifted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {result.optimizedSchedule.carbonReduction.toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground">CO₂ Avoided</p>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-4">
              <h4 className="font-medium">Schedule Changes:</h4>
              {result.optimizedSchedule.schedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{schedule.appliance}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(schedule.originalTime)} → {formatTime(schedule.recommendedTime)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {schedule.reasoning}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-green-600">
                      +${schedule.savings.toFixed(2)}
                    </Badge>
                    <Badge variant="secondary">
                      +{schedule.ecoPoints} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
