import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, Zap, Leaf, TrendingUp, 
  Star, Award, Target, Calendar
} from "lucide-react";

export interface SavingsData {
  totalSavings: number;
  ecoPoints: number;
  carbonSaved: number;
  energyShifted: number;
  level: string;
  nextLevelPoints: number;
  achievements: string[];
}

interface SavingsDashboardProps {
  savings: SavingsData;
  onStartOptimization?: () => void;
}

export default function SavingsDashboard({ savings, onStartOptimization }: SavingsDashboardProps) {
  const progressPercentage = (savings.ecoPoints / savings.nextLevelPoints) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
          🎯 Your Impact Dashboard
        </h2>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover-elevate bg-gradient-to-br from-green-50 to-emerald-100 border-green-300" data-testid="card-total-savings">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">
                💰 ${savings.totalSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-elevate bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300" data-testid="card-eco-points">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">
                🌱 {savings.ecoPoints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-elevate bg-gradient-to-br from-purple-50 to-violet-100 border-purple-300" data-testid="card-carbon-saved">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-700">
                🌍 {savings.carbonSaved.toFixed(1)}kg
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-elevate bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300" data-testid="card-energy-shifted">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-700">
                ⚡ {savings.energyShifted.toFixed(1)}kWh
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Current Level</h3>
                <Badge variant="secondary" className="mt-1">
                  {savings.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress to next level</p>
              <p className="font-medium">
                {savings.ecoPoints} / {savings.nextLevelPoints} points
              </p>
            </div>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-3"
            data-testid="progress-level"
          />
          
          <p className="text-sm text-muted-foreground text-center">
            {savings.nextLevelPoints - savings.ecoPoints} more points to reach the next level!
          </p>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Star className="w-5 h-5 text-chart-3" />
          <span>Recent Achievements</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {savings.achievements.map((achievement, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
              data-testid={`achievement-${index}`}
            >
              <div className="w-8 h-8 bg-chart-3/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-chart-3" />
              </div>
              <span className="text-sm font-medium">{achievement}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Environmental Impact */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-chart-1/5">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-lg flex items-center justify-center space-x-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span>Environmental Impact</span>
          </h3>
          <p className="text-muted-foreground">
            By shifting {savings.energyShifted.toFixed(1)} kWh to greener hours, you've helped reduce grid stress and supported renewable energy adoption.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="text-center">
              <p className="font-semibold text-chart-1">
                ≈ {Math.round(savings.carbonSaved / 0.4)} trees
              </p>
              <p className="text-muted-foreground">planted equivalent</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-chart-2">
                {Math.round(savings.energyShifted * 0.3)}%
              </p>
              <p className="text-muted-foreground">renewable energy used</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {onStartOptimization && (
        <Card className="p-8 bg-gradient-to-r from-indigo-50 to-purple-100 border-indigo-300">
          <div className="text-center">
            <Button onClick={onStartOptimization} size="lg" className="text-xl px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl">
              <Zap className="w-6 h-6 mr-3" />
              🚀 Optimize More
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}