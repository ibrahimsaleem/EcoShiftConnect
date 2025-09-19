import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
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

  // Determine status for badge colors
  const isPeakTime = currentBand.band === 'RED' || currentBand.band === 'ORANGE';
  const isOptimalTime = currentBand.band === 'GREEN';

  const getNextOptimalTime = () => {
    const greenHours = ecoBands.filter(band => band.band === 'GREEN');
    if (greenHours.length === 0) return null;
    
    // Find next green hour
    const nextGreen = greenHours.find(band => band.hour > currentHour);
    return nextGreen || greenHours[0];
  };

  const nextOptimal = getNextOptimalTime();

  const getBandEmoji = () => {
    switch (currentBand.band) {
      case 'GREEN': return '🟢';
      case 'BLUE': return '🔵';
      case 'ORANGE': return '🟠';
      case 'RED': return '🔴';
      default: return '⚪';
    }
  };

  const getBandColor = () => {
    switch (currentBand.band) {
      case 'GREEN': return 'from-green-50 to-emerald-100 border-green-300';
      case 'BLUE': return 'from-blue-50 to-cyan-100 border-blue-300';
      case 'ORANGE': return 'from-orange-50 to-amber-100 border-orange-300';
      case 'RED': return 'from-red-50 to-rose-100 border-red-300';
      default: return 'from-gray-50 to-slate-100 border-gray-300';
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getBandColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">
            {getBandEmoji()}
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              {formatTime(currentHour)}
            </h3>
            <p className="text-lg font-semibold text-gray-700">
              ${(currentBand.price / 1000).toFixed(3)}/kWh
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <Badge 
            variant={isPeakTime ? "destructive" : isOptimalTime ? "default" : "secondary"}
            className="text-lg px-4 py-2"
          >
            {currentBand.band}
          </Badge>
          <p className="text-lg font-bold mt-2">
            🌱 {currentBand.points > 0 ? `+${currentBand.points}` : currentBand.points}
          </p>
        </div>
      </div>
      
      {nextOptimal && (
        <div className="mt-4 p-3 bg-white/50 rounded-lg">
          <p className="text-sm font-medium">
            🕐 Next Green: {formatTime(nextOptimal.hour)}
          </p>
        </div>
      )}
    </Card>
  );
}

function formatTime(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}
