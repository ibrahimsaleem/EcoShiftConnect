import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, DollarSign, Leaf, TrendingUp, 
  CheckCircle, ArrowRight, Zap 
} from "lucide-react";
import GeminiTestButton from "./GeminiTestButton";
import type { Appliance, EcoBand } from "@shared/schema";

export interface OptimizedSchedule {
  appliance: string;
  icon: any;
  originalTime: number;
  recommendedTime: number;
  savings: number;
  ecoPoints: number;
  reasoning: string;
  energyUsed: number;
}

export interface ResultsSummary {
  totalSavings: number;
  totalEcoPoints: number;
  totalEnergyShifted: number;
  carbonReduction: number;
  schedules: OptimizedSchedule[];
}

interface ResultsViewProps {
  results: ResultsSummary;
  onExport: () => void;
  onStartOver: () => void;
  appliances?: Appliance[];
  ecoBands?: EcoBand[];
}

export default function ResultsView({ results, onExport, onStartOver, appliances, ecoBands }: ResultsViewProps) {
  const formatTime = (hour: number) => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Your Optimized EcoShift Plan
        </h2>
        <p className="text-muted-foreground text-lg">
          Here's your personalized schedule to maximize savings and minimize environmental impact
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6" data-testid="card-total-savings">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-chart-3/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold text-chart-3">
                ${results.totalSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-eco-points">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EcoPoints Earned</p>
              <p className="text-2xl font-bold text-primary">
                +{results.totalEcoPoints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-energy-shifted">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Energy Shifted</p>
              <p className="text-2xl font-bold text-chart-2">
                {results.totalEnergyShifted.toFixed(1)} kWh
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-carbon-saved">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-chart-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CO₂ Avoided</p>
              <p className="text-2xl font-bold text-chart-1">
                {results.carbonReduction.toFixed(1)} kg
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-xl mb-6">Smart Shift Recommendations</h3>
        <div className="space-y-6">
          {results.schedules.map((schedule, index) => {
            const IconComponent = schedule.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{schedule.appliance}</h4>
                      <p className="text-sm text-muted-foreground">
                        {schedule.energyUsed.toFixed(1)} kWh usage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-chart-3">
                      +${schedule.savings.toFixed(2)}
                    </Badge>
                    <Badge variant="secondary">
                      +{schedule.ecoPoints} points
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-6 ml-16">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Your Desired Time</p>
                    <p className="font-medium">{formatTime(schedule.originalTime)}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Optimal Shift Time</p>
                    <p className="font-medium text-primary">{formatTime(schedule.recommendedTime)}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground ml-16 p-3 bg-muted/50 rounded-lg">
                  {schedule.reasoning}
                </p>

                {index < results.schedules.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Environmental Impact */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-chart-1/5">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-xl">Your Environmental Impact</h3>
          <p className="text-muted-foreground">
            By following this schedule, you're helping reduce grid stress during peak hours and supporting renewable energy adoption.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-chart-1">
                ≈ {Math.round(results.carbonReduction / 0.4)}
              </p>
              <p className="text-muted-foreground">trees planted equivalent</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-chart-2">
                {Math.round(results.totalEnergyShifted * 0.3)}%
              </p>
              <p className="text-muted-foreground">more renewable energy</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI-Powered Optimization */}
      {appliances && ecoBands && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">🤖 AI-Powered Optimization</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get Gemini AI to analyze your appliances and eco bands data to suggest the most optimal shifts for maximum savings and eco benefits.
          </p>
          <GeminiTestButton appliances={appliances} ecoBands={ecoBands} />
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          onClick={onExport}
          data-testid="button-export-plan"
        >
          Export Your Plan
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onStartOver}
          data-testid="button-start-over"
        >
          Plan Another Schedule
        </Button>
      </div>
    </div>
  );
}