import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
}

export default function SavingsDashboard({ savings }: SavingsDashboardProps) {
  const progressPercentage = (savings.ecoPoints / savings.nextLevelPoints) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Your EcoShift Impact
        </h2>
        <p className="text-muted-foreground text-lg">
          Track your savings, points, and environmental impact
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover-elevate" data-testid="card-total-savings">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-chart-3/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold text-chart-3">
                ${savings.totalSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-elevate" data-testid="card-eco-points">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EcoPoints</p>
              <p className="text-2xl font-bold text-primary">
                {savings.ecoPoints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-elevate" data-testid="card-carbon-saved">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-chart-1/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-chart-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              <p className="text-2xl font-bold text-chart-1">
                {savings.carbonSaved.toFixed(1)}kg
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-elevate" data-testid="card-energy-shifted">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Energy Shifted</p>
              <p className="text-2xl font-bold text-chart-2">
                {savings.energyShifted.toFixed(1)}kWh
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
    </div>
  );
}