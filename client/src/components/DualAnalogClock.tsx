import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import type { EcoBand } from "@shared/schema";
import AnalogClock from "./AnalogClock";

interface DualAnalogClockProps {
  ecoBands: EcoBand[];
}

export default function DualAnalogClock({ ecoBands }: DualAnalogClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [show24Hour, setShow24Hour] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentBand = ecoBands.find(band => band.hour === currentHour) || ecoBands[0];

  // Get status for current hour
  const isPeakTime = currentBand.band === 'RED' || currentBand.band === 'ORANGE';
  const isOptimalTime = currentBand.band === 'GREEN';
  const isNeutralTime = currentBand.band === 'BLUE';

  const getStatusIcon = () => {
    if (isPeakTime) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (isOptimalTime) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <Clock className="w-5 h-5 text-blue-600" />;
  };

  const getStatusMessage = () => {
    if (isPeakTime) return "Peak Energy Time - High Costs";
    if (isOptimalTime) return "Optimal Energy Time - Low Costs";
    return "Neutral Energy Time - Moderate Costs";
  };

  const getStatusColor = () => {
    if (isPeakTime) return 'text-red-600';
    if (isOptimalTime) return 'text-green-600';
    return 'text-blue-600';
  };

  // Get next optimal time
  const getNextOptimalTime = () => {
    const greenHours = ecoBands.filter(band => band.band === 'GREEN');
    if (greenHours.length === 0) return null;
    
    const nextGreen = greenHours.find(band => band.hour > currentHour);
    return nextGreen || greenHours[0];
  };

  const nextOptimal = getNextOptimalTime();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          {getStatusIcon()}
          <h2 className="text-2xl font-bold">Energy Clock</h2>
        </div>
        <p className={`font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
        <p className="text-sm text-muted-foreground">
          Real-time electricity pricing with color-coded timing
        </p>
      </div>

      {/* Clock Display Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
          <Button
            variant={!show24Hour ? "default" : "ghost"}
            size="sm"
            onClick={() => setShow24Hour(false)}
          >
            12-Hour
          </Button>
          <Button
            variant={show24Hour ? "default" : "ghost"}
            size="sm"
            onClick={() => setShow24Hour(true)}
          >
            24-Hour
          </Button>
        </div>
      </div>

      {/* Dual Clock Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Time Clock */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Current Time</h3>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Badge 
                variant={isPeakTime ? "destructive" : isOptimalTime ? "default" : "secondary"}
                className="text-sm"
              >
                {currentBand.band} Band
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: !show24Hour 
                })}
              </span>
            </div>
          </div>
          
          <AnalogClock 
            ecoBands={ecoBands} 
            showSeconds={true} 
            size="lg" 
          />
          
          {/* Current Rate Info */}
          <Card className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Current Rate</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: getStatusColor() }}>
                ${(currentBand.price / 1000).toFixed(3)}/kWh
              </div>
              <div className="text-sm text-muted-foreground">
                {currentBand.description}
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Credit: </span>
                  <span className={currentBand.credit > 0 ? 'text-green-600' : currentBand.credit < 0 ? 'text-red-600' : 'text-muted-foreground'}>
                    {currentBand.credit > 0 ? `+$${currentBand.credit.toFixed(3)}` : 
                     currentBand.credit < 0 ? `$${Math.abs(currentBand.credit).toFixed(3)}` : 
                     '$0.000'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Points: </span>
                  <span className={currentBand.points > 0 ? 'text-green-600' : currentBand.points < 0 ? 'text-red-600' : 'text-muted-foreground'}>
                    {currentBand.points > 0 ? `+${currentBand.points}` : currentBand.points}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Next Optimal Time Clock */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Next Optimal Time</h3>
            {nextOptimal ? (
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Badge variant="default" className="text-sm">
                  GREEN Band
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatTime(nextOptimal.hour)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mb-2">
                No optimal time found
              </div>
            )}
          </div>
          
          {nextOptimal ? (
            <>
              <AnalogClock 
                ecoBands={[nextOptimal]} 
                showSeconds={false} 
                size="lg" 
              />
              
              {/* Next Optimal Rate Info */}
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Optimal Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${(nextOptimal.price / 1000).toFixed(3)}/kWh
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {nextOptimal.description}
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Credit: </span>
                      <span className="text-green-600">
                        +${nextOptimal.credit.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Points: </span>
                      <span className="text-green-600">
                        +{nextOptimal.points}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2" />
                <p>No optimal time available</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Time Zone Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>All times shown in your local timezone</p>
        <p>Rates update every hour based on grid conditions</p>
      </div>
    </div>
  );
}

function formatTime(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}
