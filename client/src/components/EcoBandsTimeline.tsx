import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Leaf, AlertTriangle, Zap, DollarSign, Sparkles } from "lucide-react";
import type { EcoBand } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface EcoBandsTimelineProps {
  onCalculateOptimal: () => void;
}

export default function EcoBandsTimeline({ onCalculateOptimal }: EcoBandsTimelineProps) {
  const { data: ecoBands = [], isLoading, error } = useQuery<EcoBand[]>({
    queryKey: ['/api/eco-bands'],
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Loading Eco Bands...</h2>
          <p className="text-muted-foreground text-lg">Fetching Houston's real-time energy data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Unable to Load Eco Bands</h2>
          <p className="text-muted-foreground text-lg">Please try again later</p>
        </div>
      </div>
    );
  }
  const getBandColor = (band: string) => {
    switch (band) {
      case 'GREEN': return 'bg-chart-1 border-chart-1/30';
      case 'BLUE': return 'bg-chart-2 border-chart-2/30';
      case 'ORANGE': return 'bg-chart-3 border-chart-3/30';
      case 'RED': return 'bg-chart-5 border-chart-5/30';
      default: return 'bg-muted';
    }
  };

  const getBandIcon = (band: string) => {
    switch (band) {
      case 'GREEN': return <Leaf className="w-3 h-3 text-white" />;
      case 'BLUE': return <Zap className="w-3 h-3 text-white" />;
      case 'ORANGE': return <AlertTriangle className="w-3 h-3 text-white" />;
      case 'RED': return <DollarSign className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  const getBandLabel = (band: string) => {
    switch (band) {
      case 'GREEN': return 'Eco Reward';
      case 'BLUE': return 'Neutral';
      case 'ORANGE': return 'Caution';
      case 'RED': return 'Peak Penalty';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Today's Eco Bands
        </h2>
        <p className="text-muted-foreground text-lg">
          Houston's 24-hour energy timeline. Green hours earn rewards, red hours cost more.
        </p>
      </div>

      {/* Legend */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Eco Band Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-chart-1 rounded flex items-center justify-center">
              <Leaf className="w-2 h-2 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">GREEN - Reward</p>
              <p className="text-xs text-muted-foreground">+5¢/kWh, +3 points</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-chart-2 rounded flex items-center justify-center">
              <Zap className="w-2 h-2 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">BLUE - Neutral</p>
              <p className="text-xs text-muted-foreground">+2¢/kWh, +1 point</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-chart-3 rounded flex items-center justify-center">
              <AlertTriangle className="w-2 h-2 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">ORANGE - Caution</p>
              <p className="text-xs text-muted-foreground">No bonus</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-chart-5 rounded flex items-center justify-center">
              <DollarSign className="w-2 h-2 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">RED - Penalty</p>
              <p className="text-xs text-muted-foreground">-5¢/kWh, -2 points</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6">24-Hour Timeline</h3>
        <div className="space-y-4">
          {/* Hour labels */}
          <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground mb-2">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="text-center">
                {i === 0 ? '12a' : `${i}a`}
              </div>
            ))}
          </div>
          
          {/* AM Timeline */}
          <div className="grid grid-cols-12 gap-1 h-16">
            {ecoBands.slice(0, 12).map((band, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div 
                    className={`${getBandColor(band.band)} rounded-md border-2 h-full flex flex-col items-center justify-center cursor-pointer hover-elevate transition-all`}
                    data-testid={`band-${band.hour}`}
                  >
                    {getBandIcon(band.band)}
                    <span className="text-xs text-white font-medium mt-1">
                      {band.hour}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{getBandLabel(band.band)}</p>
                    <p className="text-sm">${band.price.toFixed(2)}/MWh</p>
                    <p className="text-xs">{band.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Hour labels PM */}
          <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground mb-2 mt-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="text-center">
                {i === 0 ? '12p' : `${i}p`}
              </div>
            ))}
          </div>
          
          {/* PM Timeline */}
          <div className="grid grid-cols-12 gap-1 h-16">
            {ecoBands.slice(12, 24).map((band, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div 
                    className={`${getBandColor(band.band)} rounded-md border-2 h-full flex flex-col items-center justify-center cursor-pointer hover-elevate transition-all`}
                    data-testid={`band-${band.hour}`}
                  >
                    {getBandIcon(band.band)}
                    <span className="text-xs text-white font-medium mt-1">
                      {band.hour}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{getBandLabel(band.band)}</p>
                    <p className="text-sm">${band.price.toFixed(2)}/MWh</p>
                    <p className="text-xs">{band.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button 
          size="lg" 
          onClick={onCalculateOptimal}
          data-testid="button-calculate-optimal"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Get AI Optimization
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          AI will analyze your appliances and find the optimal schedule
        </p>
      </div>
    </div>
  );
}