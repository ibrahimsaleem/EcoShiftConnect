import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import WelcomeHero from "@/components/WelcomeHero";
import ApplianceSelector, { type Appliance } from "@/components/ApplianceSelector";
import EcoBandsTimeline, { type EcoBand } from "@/components/EcoBandsTimeline";
import ResultsView, { type ResultsSummary } from "@/components/ResultsView";
import SavingsDashboard, { type SavingsData } from "@/components/SavingsDashboard";
import ExportPanel, { type ExportData } from "@/components/ExportPanel";
import ThemeToggle from "@/components/ThemeToggle";

// Icons
import { 
  Zap, Car, Utensils, Shirt, Droplets, Snowflake, 
  Lightbulb, Tv, WashingMachine, Wind 
} from "lucide-react";

type AppStep = 'welcome' | 'appliances' | 'ecobands' | 'results' | 'dashboard';

function EcoShiftApp() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [showExport, setShowExport] = useState(false);
  
  // App State
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 'ev', name: 'Electric Vehicle', icon: Car, powerMin: 3000, powerMax: 7000, defaultRuntime: 6, selected: false },
    { id: 'dishwasher', name: 'Dishwasher', icon: Utensils, powerMin: 1200, powerMax: 1500, defaultRuntime: 2, selected: false },
    { id: 'dryer', name: 'Clothes Dryer', icon: Shirt, powerMin: 2000, powerMax: 4000, defaultRuntime: 1, selected: false },
    { id: 'washer', name: 'Washing Machine', icon: WashingMachine, powerMin: 400, powerMax: 800, defaultRuntime: 1, selected: false },
    { id: 'waterheater', name: 'Water Heater', icon: Droplets, powerMin: 3000, powerMax: 4500, defaultRuntime: 2, selected: false },
    { id: 'ac', name: 'Air Conditioner', icon: Snowflake, powerMin: 2000, powerMax: 5000, defaultRuntime: 8, selected: false },
    { id: 'lights', name: 'LED Lighting', icon: Lightbulb, powerMin: 100, powerMax: 300, defaultRuntime: 6, selected: false },
    { id: 'tv', name: 'Smart TV', icon: Tv, powerMin: 100, powerMax: 200, defaultRuntime: 4, selected: false },
  ]);

  // Mock eco bands data (based on Houston pricing data)
  const ecoBands: EcoBand[] = [
    { hour: 0, band: 'BLUE', price: 27.75, credit: 0.02, points: 1, description: 'Neutral period with low demand' },
    { hour: 1, band: 'BLUE', price: 25.62, credit: 0.02, points: 1, description: 'Overnight low usage' },
    { hour: 2, band: 'GREEN', price: 24.57, credit: 0.05, points: 3, description: 'Great time for appliances!' },
    { hour: 3, band: 'GREEN', price: 24.00, credit: 0.05, points: 3, description: 'Eco-friendly early hours' },
    { hour: 4, band: 'GREEN', price: 24.53, credit: 0.05, points: 3, description: 'Perfect for overnight charging' },
    { hour: 5, band: 'BLUE', price: 26.97, credit: 0.02, points: 1, description: 'Pre-dawn neutral' },
    { hour: 6, band: 'ORANGE', price: 29.98, credit: 0.0, points: 0, description: 'Morning startup caution' },
    { hour: 7, band: 'BLUE', price: 26.27, credit: 0.02, points: 1, description: 'Morning neutral' },
    { hour: 8, band: 'GREEN', price: 20.26, credit: 0.05, points: 3, description: 'Solar surplus begins' },
    { hour: 9, band: 'GREEN', price: 18.91, credit: 0.05, points: 3, description: 'High solar generation' },
    { hour: 10, band: 'GREEN', price: 20.78, credit: 0.07, points: 3, description: 'Peak solar bonus!' },
    { hour: 11, band: 'BLUE', price: 25.99, credit: 0.04, points: 1, description: 'Solar bonus continues' },
    { hour: 12, band: 'ORANGE', price: 34.92, credit: 0.02, points: 0, description: 'Afternoon peak begins' },
    { hour: 13, band: 'ORANGE', price: 33.08, credit: 0.02, points: 0, description: 'High demand period' },
    { hour: 14, band: 'ORANGE', price: 34.01, credit: 0.02, points: 0, description: 'Grid stress builds' },
    { hour: 15, band: 'RED', price: 37.99, credit: -0.03, points: -2, description: 'Peak stress - avoid usage!' },
    { hour: 16, band: 'ORANGE', price: 37.31, credit: 0.0, points: 0, description: 'Still high demand' },
    { hour: 17, band: 'ORANGE', price: 37.23, credit: 0.0, points: 0, description: 'Evening buildup' },
    { hour: 18, band: 'RED', price: 46.24, credit: -0.05, points: -2, description: 'Peak evening demand!' },
    { hour: 19, band: 'RED', price: 62.93, credit: -0.05, points: -2, description: 'Highest cost period' },
    { hour: 20, band: 'RED', price: 63.27, credit: -0.05, points: -2, description: 'Extreme peak pricing' },
    { hour: 21, band: 'RED', price: 57.60, credit: -0.05, points: -2, description: 'Still very expensive' },
    { hour: 22, band: 'RED', price: 39.09, credit: -0.05, points: -2, description: 'Late evening peak' },
    { hour: 23, band: 'BLUE', price: 29.91, credit: 0.02, points: 1, description: 'Settling down for night' },
  ];

  // Calculate optimized results (simplified logic for demo)
  const calculateOptimalSchedule = (): ResultsSummary => {
    const selectedAppliances = appliances.filter(a => a.selected);
    const schedules = selectedAppliances.map(appliance => {
      // Find best time slots (GREEN hours)
      const greenHours = ecoBands.filter(band => band.band === 'GREEN').map(b => b.hour);
      const recommendedTime = greenHours[Math.floor(Math.random() * greenHours.length)];
      
      // Calculate savings (simplified)
      const avgPower = (appliance.powerMin + appliance.powerMax) / 2;
      const runtime = appliance.runtime || appliance.defaultRuntime;
      const energyUsed = (avgPower / 1000) * runtime;
      
      // Mock original time (typically evening peak)
      const originalTime = 18 + Math.floor(Math.random() * 4);
      
      // Calculate savings based on price difference
      const originalBand = ecoBands.find(b => b.hour === originalTime);
      const recommendedBand = ecoBands.find(b => b.hour === recommendedTime);
      
      const priceDiff = ((originalBand?.price || 40) - (recommendedBand?.price || 25)) / 1000; // Convert MWh to kWh
      const savings = energyUsed * priceDiff;
      const ecoPoints = energyUsed * (recommendedBand?.points || 3);

      return {
        appliance: appliance.name,
        icon: appliance.icon,
        originalTime,
        recommendedTime,
        savings: Math.max(savings, 0.5),
        ecoPoints: Math.floor(ecoPoints),
        reasoning: `Shift to ${recommendedBand?.band === 'GREEN' ? 'solar surplus' : 'low demand'} hours avoids peak pricing and earns EcoPoints. ${appliance.name.includes('EV') ? 'Perfect for overnight charging!' : 'Great timing for eco-friendly operation.'}`,
        energyUsed
      };
    });

    return {
      totalSavings: schedules.reduce((sum, s) => sum + s.savings, 0),
      totalEcoPoints: schedules.reduce((sum, s) => sum + s.ecoPoints, 0),
      totalEnergyShifted: schedules.reduce((sum, s) => sum + s.energyUsed, 0),
      carbonReduction: schedules.reduce((sum, s) => sum + s.energyUsed * 0.4, 0),
      schedules
    };
  };

  const mockSavingsData: SavingsData = {
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

  const handleExport = () => {
    const results = calculateOptimalSchedule();
    const exportData: ExportData = {
      totalSavings: results.totalSavings,
      totalEcoPoints: results.totalEcoPoints,
      schedules: results.schedules.map(s => ({
        appliance: s.appliance,
        originalTime: s.originalTime,
        recommendedTime: s.recommendedTime,
        savings: s.savings,
        ecoPoints: s.ecoPoints
      })),
      summary: "By shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!"
    };
    setShowExport(true);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeHero 
            onGetStarted={() => setCurrentStep('appliances')} 
          />
        );
      
      case 'appliances':
        return (
          <div className="min-h-screen bg-background">
            <header className="border-b border-border p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary">EcoShift</h1>
                <ThemeToggle />
              </div>
            </header>
            <ApplianceSelector
              appliances={appliances}
              onApplianceUpdate={setAppliances}
              onNext={() => setCurrentStep('ecobands')}
            />
          </div>
        );
      
      case 'ecobands':
        return (
          <div className="min-h-screen bg-background">
            <header className="border-b border-border p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary">EcoShift</h1>
                <ThemeToggle />
              </div>
            </header>
            <EcoBandsTimeline
              ecoBands={ecoBands}
              onCalculateOptimal={() => setCurrentStep('results')}
            />
          </div>
        );
      
      case 'results':
        return (
          <div className="min-h-screen bg-background">
            <header className="border-b border-border p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary">EcoShift</h1>
                <ThemeToggle />
              </div>
            </header>
            <ResultsView
              results={calculateOptimalSchedule()}
              onExport={handleExport}
              onStartOver={() => {
                setAppliances(appliances.map(a => ({ ...a, selected: false })));
                setCurrentStep('welcome');
              }}
            />
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="min-h-screen bg-background">
            <header className="border-b border-border p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary">EcoShift</h1>
                <ThemeToggle />
              </div>
            </header>
            <SavingsDashboard savings={mockSavingsData} />
          </div>
        );
      
      default:
        return <NotFound />;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
      
      {/* Navigation Footer (only show after welcome) */}
      {currentStep !== 'welcome' && (
        <div className="fixed bottom-6 right-6 space-x-2">
          <button
            onClick={() => setCurrentStep('dashboard')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover-elevate"
            data-testid="button-view-dashboard"
          >
            View Dashboard
          </button>
        </div>
      )}
      
      {/* Export Modal */}
      {showExport && (
        <ExportPanel
          data={{
            totalSavings: calculateOptimalSchedule().totalSavings,
            totalEcoPoints: calculateOptimalSchedule().totalEcoPoints,
            schedules: calculateOptimalSchedule().schedules.map(s => ({
              appliance: s.appliance,
              originalTime: s.originalTime,
              recommendedTime: s.recommendedTime,
              savings: s.savings,
              ecoPoints: s.ecoPoints
            })),
            summary: "By shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!"
          }}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={EcoShiftApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;