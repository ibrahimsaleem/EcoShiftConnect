import ResultsView, { type ResultsSummary } from '../ResultsView';
import { Car, Utensils, Shirt, Droplets } from "lucide-react";

export default function ResultsViewExample() {
  const mockResults: ResultsSummary = {
    totalSavings: 18.75,
    totalEcoPoints: 145,
    totalEnergyShifted: 42.3,
    carbonReduction: 8.9,
    schedules: [
      {
        appliance: "Electric Vehicle",
        icon: Car,
        originalTime: 18,
        recommendedTime: 2,
        savings: 12.40,
        ecoPoints: 90,
        reasoning: "Shift to overnight green hours (2-4 AM) avoids peak pricing and earns maximum EcoPoints. Your EV will be fully charged by morning while supporting renewable energy.",
        energyUsed: 24.0
      },
      {
        appliance: "Dishwasher",
        icon: Utensils,
        originalTime: 19,
        recommendedTime: 10,
        savings: 3.25,
        ecoPoints: 18,
        reasoning: "Running during solar surplus hours (10-11 AM) takes advantage of low prices and clean energy. Perfect timing for clean dishes with clean power.",
        energyUsed: 3.0
      },
      {
        appliance: "Clothes Dryer",
        icon: Shirt,
        originalTime: 20,
        recommendedTime: 9,
        savings: 2.85,
        ecoPoints: 25,
        reasoning: "Morning solar hours offer great savings and environmental benefits. Your clothes will be ready by afternoon while supporting the grid.",
        energyUsed: 4.5
      },
      {
        appliance: "Water Heater",
        icon: Droplets,
        originalTime: 17,
        recommendedTime: 11,
        savings: 0.25,
        ecoPoints: 12,
        reasoning: "Slight shift to late morning captures solar bonus and avoids afternoon peak buildup. Small change, meaningful impact.",
        energyUsed: 10.8
      }
    ]
  };

  return (
    <ResultsView 
      results={mockResults}
      onExport={() => console.log('Export plan clicked')}
      onStartOver={() => console.log('Start over clicked')}
    />
  );
}