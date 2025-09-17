import { useState } from 'react';
import ApplianceSelector, { type Appliance } from '../ApplianceSelector';
import { 
  Zap, Car, Utensils, Shirt, Droplets, Snowflake, 
  Lightbulb, Tv, WashingMachine, Wind 
} from "lucide-react";

export default function ApplianceSelectorExample() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 'ev', name: 'Electric Vehicle', icon: Car, powerMin: 3000, powerMax: 7000, defaultRuntime: 6, selected: false },
    { id: 'dishwasher', name: 'Dishwasher', icon: Utensils, powerMin: 1200, powerMax: 1500, defaultRuntime: 2, selected: false },
    { id: 'dryer', name: 'Clothes Dryer', icon: Shirt, powerMin: 2000, powerMax: 4000, defaultRuntime: 1, selected: false },
    { id: 'washer', name: 'Washing Machine', icon: WashingMachine, powerMin: 400, powerMax: 800, defaultRuntime: 1, selected: false },
    { id: 'waterheater', name: 'Water Heater', icon: Droplets, powerMin: 3000, powerMax: 4500, defaultRuntime: 2, selected: false },
    { id: 'ac', name: 'Air Conditioner', icon: Snowflake, powerMin: 2000, powerMax: 5000, defaultRuntime: 8, selected: false },
  ]);

  return (
    <ApplianceSelector 
      appliances={appliances}
      onApplianceUpdate={setAppliances}
      onNext={() => console.log('Next clicked', appliances.filter(a => a.selected))}
    />
  );
}