import SavingsDashboard, { type SavingsData } from '../SavingsDashboard';

export default function SavingsDashboardExample() {
  const mockSavings: SavingsData = {
    totalSavings: 127.45,
    ecoPoints: 850,
    carbonSaved: 23.7,
    energyShifted: 145.2,
    level: "Eco Hero",
    nextLevelPoints: 1000,
    achievements: [
      "First Week Complete!",
      "50 kWh Shifted",
      "Peak Hour Avoider",
      "Green Hour Champion"
    ]
  };

  return <SavingsDashboard savings={mockSavings} />;
}