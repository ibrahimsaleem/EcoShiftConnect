import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Zap, Car, Utensils, Shirt, Droplets, Snowflake, 
  Lightbulb, Tv, WashingMachine, Wind 
} from "lucide-react";
import type { Appliance } from "@shared/schema";

export interface ApplianceWithIcon extends Appliance {
  icon: any;
}

interface ApplianceSelectorProps {
  appliances: ApplianceWithIcon[];
  onApplianceUpdate: (appliances: ApplianceWithIcon[]) => void;
  onNext: () => void;
}

export default function ApplianceSelector({ 
  appliances, 
  onApplianceUpdate, 
  onNext 
}: ApplianceSelectorProps) {
  const [selectedAppliances, setSelectedAppliances] = useState(appliances);

  const toggleAppliance = (id: string) => {
    const updated = selectedAppliances.map(appliance => 
      appliance.id === id 
        ? { ...appliance, selected: !appliance.selected }
        : appliance
    );
    setSelectedAppliances(updated);
    onApplianceUpdate(updated);
  };

  const updateApplianceSettings = (id: string, field: string, value: number) => {
    const updated = selectedAppliances.map(appliance => 
      appliance.id === id 
        ? { ...appliance, [field]: value }
        : appliance
    );
    setSelectedAppliances(updated);
    onApplianceUpdate(updated);
  };

  const selectedCount = selectedAppliances.filter(a => a.selected).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Select Your Appliances
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose the appliances you'd like to optimize. We'll help you find the best times to run them.
        </p>
        <Badge variant="secondary" className="text-sm">
          {selectedCount} appliance{selectedCount !== 1 ? 's' : ''} selected
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedAppliances.map((appliance) => {
          const IconComponent = appliance.icon;
          const avgPower = (appliance.powerMin + appliance.powerMax) / 2;
          
          return (
            <Card 
              key={appliance.id}
              className={`p-6 cursor-pointer transition-all hover-elevate ${
                appliance.selected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'border-border'
              }`}
              onClick={() => toggleAppliance(appliance.id)}
              data-testid={`card-appliance-${appliance.id}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      appliance.selected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{appliance.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {appliance.powerMin}-{appliance.powerMax}W
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ~{Math.round(avgPower)}W
                  </Badge>
                </div>

                {appliance.selected && (
                  <div className="space-y-4 pt-4 border-t border-border" onClick={e => e.stopPropagation()}>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`runtime-${appliance.id}`} className="text-xs">
                          Runtime (hours)
                        </Label>
                        <Input
                          id={`runtime-${appliance.id}`}
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={appliance.runtime || appliance.defaultRuntime}
                          onChange={(e) => updateApplianceSettings(appliance.id, 'runtime', parseFloat(e.target.value))}
                          className="h-8 text-sm"
                          data-testid={`input-runtime-${appliance.id}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`start-time-${appliance.id}`} className="text-xs">
                          Desired Start Time
                        </Label>
                        <select
                          id={`start-time-${appliance.id}`}
                          value={appliance.startTime || 19} // Default to 7 PM
                          onChange={(e) => updateApplianceSettings(appliance.id, 'startTime', parseInt(e.target.value))}
                          className="h-8 text-sm border border-input bg-background px-3 py-1 rounded-md"
                          data-testid={`select-start-time-${appliance.id}`}
                        >
                          <option value={0}>12:00 AM</option>
                          <option value={1}>1:00 AM</option>
                          <option value={2}>2:00 AM</option>
                          <option value={3}>3:00 AM</option>
                          <option value={4}>4:00 AM</option>
                          <option value={5}>5:00 AM</option>
                          <option value={6}>6:00 AM</option>
                          <option value={7}>7:00 AM</option>
                          <option value={8}>8:00 AM</option>
                          <option value={9}>9:00 AM</option>
                          <option value={10}>10:00 AM</option>
                          <option value={11}>11:00 AM</option>
                          <option value={12}>12:00 PM</option>
                          <option value={13}>1:00 PM</option>
                          <option value={14}>2:00 PM</option>
                          <option value={15}>3:00 PM</option>
                          <option value={16}>4:00 PM</option>
                          <option value={17}>5:00 PM</option>
                          <option value={18}>6:00 PM</option>
                          <option value={19}>7:00 PM</option>
                          <option value={20}>8:00 PM</option>
                          <option value={21}>9:00 PM</option>
                          <option value={22}>10:00 PM</option>
                          <option value={23}>11:00 PM</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                          When you'd normally start this appliance. EcoShift will find the best time to shift it for maximum savings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          disabled={selectedCount === 0}
          onClick={onNext}
          data-testid="button-next-eco-bands"
        >
          View Eco Bands ({selectedCount} selected)
        </Button>
      </div>
    </div>
  );
}