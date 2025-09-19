import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EcoBand } from "@shared/schema";

interface AnalogClockProps {
  ecoBands: EcoBand[];
  showSeconds?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnalogClock({ 
  ecoBands, 
  showSeconds = true, 
  size = 'md' 
}: AnalogClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentSecond = currentTime.getSeconds();

  // Get current hour's eco band data
  const currentBand = ecoBands.find(band => band.hour === currentHour) || ecoBands[0];

  // Calculate angles for clock hands
  const secondAngle = (currentSecond * 6) - 90; // 6 degrees per second
  const minuteAngle = (currentMinute * 6) + (currentSecond * 0.1) - 90; // 6 degrees per minute + seconds offset
  const hourAngle = ((currentHour % 12) * 30) + (currentMinute * 0.5) - 90; // 30 degrees per hour + minutes offset

  // Get band colors
  const getBandColor = (band: string) => {
    switch (band) {
      case 'GREEN': return '#10b981';
      case 'BLUE': return '#3b82f6';
      case 'ORANGE': return '#f97316';
      case 'RED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getBandBgColor = (band: string) => {
    switch (band) {
      case 'GREEN': return 'bg-green-50 border-green-200';
      case 'BLUE': return 'bg-blue-50 border-blue-200';
      case 'ORANGE': return 'bg-orange-50 border-orange-200';
      case 'RED': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-32 h-32';
      case 'lg': return 'w-48 h-48';
      default: return 'w-40 h-40';
    }
  };

  const getHandLengths = () => {
    switch (size) {
      case 'sm': return { hour: 20, minute: 30, second: 35 };
      case 'lg': return { hour: 30, minute: 45, second: 50 };
      default: return { hour: 25, minute: 35, second: 40 };
    }
  };

  const handLengths = getHandLengths();

  return (
    <Card className={`p-4 ${getBandBgColor(currentBand.band)} border-2`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Clock Face */}
        <div className={`relative ${getSizeClasses()} rounded-full border-4 border-foreground/20 bg-background shadow-lg`}>
          {/* Hour Markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) - 90;
            const isHour = i % 3 === 0;
            const markerLength = isHour ? 8 : 4;
            const markerWidth = isHour ? 3 : 2;
            
            return (
              <div
                key={i}
                className="absolute w-1 bg-foreground/60 rounded-full"
                style={{
                  height: `${markerLength}px`,
                  width: `${markerWidth}px`,
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${angle}deg) translateY(-50%)`,
                  marginLeft: `-${markerWidth/2}px`,
                }}
              />
            );
          })}

          {/* Hour Numbers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) - 90;
            const radius = size === 'sm' ? 45 : size === 'lg' ? 65 : 55;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const hour = i === 0 ? 12 : i;
            
            return (
              <div
                key={i}
                className="absolute text-sm font-bold text-foreground"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {hour}
              </div>
            );
          })}

          {/* Clock Hands */}
          {/* Hour Hand */}
          <div
            className="absolute w-1 bg-foreground rounded-full origin-bottom"
            style={{
              height: `${handLengths.hour}px`,
              top: '50%',
              left: '50%',
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
              zIndex: 3,
            }}
          />

          {/* Minute Hand */}
          <div
            className="absolute w-1 bg-foreground/80 rounded-full origin-bottom"
            style={{
              height: `${handLengths.minute}px`,
              top: '50%',
              left: '50%',
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
              zIndex: 2,
            }}
          />

          {/* Second Hand */}
          {showSeconds && (
            <div
              className="absolute w-0.5 bg-red-500 rounded-full origin-bottom"
              style={{
                height: `${handLengths.second}px`,
                top: '50%',
              left: '50%',
                transformOrigin: '50% 100%',
                transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
                zIndex: 4,
              }}
            />
          )}

          {/* Center Dot */}
          <div className="absolute w-3 h-3 bg-foreground rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
        </div>

        {/* Time Display */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: showSeconds ? '2-digit' : undefined,
              hour12: true 
            })}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Energy Rate Display */}
        <div className="text-center space-y-2">
          <Badge 
            variant={currentBand.band === 'RED' ? "destructive" : 
                   currentBand.band === 'GREEN' ? "default" : "secondary"}
            className="text-sm"
          >
            {currentBand.band} Band
          </Badge>
          <div className="text-lg font-bold" style={{ color: getBandColor(currentBand.band) }}>
            ${(currentBand.price / 1000).toFixed(3)}/kWh
          </div>
          <div className="text-sm text-muted-foreground">
            {currentBand.credit > 0 ? `+$${currentBand.credit.toFixed(3)} credit` : 
             currentBand.credit < 0 ? `$${Math.abs(currentBand.credit).toFixed(3)} penalty` : 
             'No credit/penalty'}
          </div>
          <div className="text-sm" style={{ color: getBandColor(currentBand.band) }}>
            {currentBand.points > 0 ? `+${currentBand.points} points` : 
             currentBand.points < 0 ? `${currentBand.points} points` : 
             'No points'}
          </div>
        </div>
      </div>
    </Card>
  );
}
