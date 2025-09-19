import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Leaf,
  Thermometer,
  Lightbulb,
  Car,
  WashingMachine
} from "lucide-react";
import type { EcoBand } from "@shared/schema";

interface EnergyStatusIndicatorProps {
  ecoBands: EcoBand[];
}

export default function EnergyStatusIndicator({ ecoBands }: EnergyStatusIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentHour, setCurrentHour] = useState(currentTime.getHours());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentHour(now.getHours());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Get current hour's eco band data
  const currentBand = ecoBands.find(band => band.hour === currentHour) || ecoBands[0];
  const nextHourBand = ecoBands.find(band => band.hour === (currentHour + 1) % 24) || ecoBands[0];

  // Determine status and suggestions
  const isPeakTime = currentBand.band === 'RED' || currentBand.band === 'ORANGE';
  const isOptimalTime = currentBand.band === 'GREEN';
  const isNeutralTime = currentBand.band === 'BLUE';

  const getStatusColor = () => {
    if (isPeakTime) return 'text-red-600';
    if (isOptimalTime) return 'text-green-600';
    return 'text-blue-600';
  };

  const getStatusIcon = () => {
    if (isPeakTime) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (isOptimalTime) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <Clock className="w-5 h-5 text-blue-600" />;
  };

  const getStatusMessage = () => {
    if (isPeakTime) {
      return "Peak energy time - High costs and penalties";
    }
    if (isOptimalTime) {
      return "Optimal energy time - Low costs and rewards";
    }
    return "Neutral energy time - Moderate costs";
  };

  const getSuggestions = () => {
    if (isPeakTime) {
      return [
        "❌ Avoid running high-energy appliances",
        "🌡️ Set AC to 78°F or higher",
        "💡 Turn off unnecessary lights",
        "🚗 Delay EV charging until off-peak",
        "🧺 Postpone laundry and dishwasher"
      ];
    }
    if (isOptimalTime) {
      return [
        "✅ Perfect time for EV charging",
        "🧺 Run dishwasher and laundry",
        "🌡️ Pre-cool your home with AC",
        "💡 Use energy-intensive appliances",
        "🔋 Charge all devices and batteries"
      ];
    }
    return [
      "⚡ Moderate energy usage is fine",
      "🌡️ Keep AC at comfortable levels",
      "💡 Use LED lights efficiently",
      "🔌 Standard appliance usage OK"
    ];
  };

  const getNextOptimalTime = () => {
    const greenHours = ecoBands.filter(band => band.band === 'GREEN');
    if (greenHours.length === 0) return null;
    
    // Find next green hour
    const nextGreen = greenHours.find(band => band.hour > currentHour);
    return nextGreen || greenHours[0];
  };

  const nextOptimal = getNextOptimalTime();

  return (
    <Card className="p-4 border-l-4 border-l-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-lg">Current Energy Status</h3>
            <p className="text-sm text-muted-foreground">
              {formatTime(currentHour)} • {currentBand.band} Band
            </p>
          </div>
        </div>
        <Badge 
          variant={isPeakTime ? "destructive" : isOptimalTime ? "default" : "secondary"}
          className="text-sm"
        >
          {currentBand.band}
        </Badge>
      </div>

      {/* Current Rate Display */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Current Rate</span>
          </div>
          <p className={`text-2xl font-bold ${getStatusColor()}`}>
            ${(currentBand.price / 1000).toFixed(3)}/kWh
          </p>
          <p className="text-xs text-muted-foreground">
            {currentBand.credit > 0 ? `+$${currentBand.credit.toFixed(3)} credit` : 
             currentBand.credit < 0 ? `$${Math.abs(currentBand.credit).toFixed(3)} penalty` : 
             'No credit/penalty'}
          </p>
        </div>

        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Leaf className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Eco Points</span>
          </div>
          <p className={`text-2xl font-bold ${currentBand.points > 0 ? 'text-green-600' : currentBand.points < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
            {currentBand.points > 0 ? `+${currentBand.points}` : currentBand.points}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentBand.points > 0 ? 'Earn points' : currentBand.points < 0 ? 'Lose points' : 'No points'}
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className={`p-3 rounded-lg mb-4 ${
        isPeakTime ? 'bg-red-50 border border-red-200' : 
        isOptimalTime ? 'bg-green-50 border border-green-200' : 
        'bg-blue-50 border border-blue-200'
      }`}>
        <p className={`font-medium ${
          isPeakTime ? 'text-red-800' : 
          isOptimalTime ? 'text-green-800' : 
          'text-blue-800'
        }`}>
          {getStatusMessage()}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {currentBand.description}
        </p>
      </div>

      {/* Suggestions */}
      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-sm">💡 Smart Suggestions:</h4>
        <ul className="space-y-1">
          {getSuggestions().map((suggestion, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Next Optimal Time */}
      {nextOptimal && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Next Optimal Time</span>
          </div>
          <p className="text-sm text-green-700">
            {formatTime(nextOptimal.hour)} - {nextOptimal.description}
          </p>
          <p className="text-xs text-green-600 mt-1">
            ${(nextOptimal.price / 1000).toFixed(3)}/kWh • +{nextOptimal.points} points
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex space-x-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('/pricing-dashboard', '_blank')}
          className="flex-1"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full Pricing
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          className="flex-1"
        >
          <Clock className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>
    </Card>
  );
}

function formatTime(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}
