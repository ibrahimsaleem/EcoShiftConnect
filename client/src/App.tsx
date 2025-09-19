import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PricingDashboardPage from "@/pages/pricing-dashboard";
import AnalogClockPage from "@/pages/analog-clock";

// Components
import WelcomeHero from "@/components/WelcomeHero";
import ApplianceSelector, { type ApplianceWithIcon } from "@/components/ApplianceSelector";
import EcoBandsTimeline from "@/components/EcoBandsTimeline";
import ResultsView, { type ResultsSummary } from "@/components/ResultsView";
import SavingsDashboard, { type SavingsData } from "@/components/SavingsDashboard";
import ExportPanel, { type ExportData } from "@/components/ExportPanel";
import NavigationBar, { type AppStep } from "@/components/NavigationBar";
import EnergyStatusIndicator from "@/components/EnergyStatusIndicator";
import DualAnalogClock from "@/components/DualAnalogClock";
import WeatherOptimizer from "@/components/WeatherOptimizer";
import GeminiTestButton from "@/components/GeminiTestButton";
import { Button } from "@/components/ui/button";

// Types
import type { Appliance, EcoBand } from "@shared/schema";

// Icons
import { 
  Zap, Car, Utensils, Shirt, Droplets, Snowflake, 
  Lightbulb, Tv, WashingMachine, Wind 
} from "lucide-react";


function EcoShiftApp() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [showExport, setShowExport] = useState(false);
  
  // App State
  const [appliances, setAppliances] = useState<ApplianceWithIcon[]>([
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

  // Calculate optimized results based on desired start time
  const calculateOptimalSchedule = (): ResultsSummary => {
    const selectedAppliances = appliances.filter(a => a.selected);
    const schedules = selectedAppliances.map(appliance => {
      const avgPower = (appliance.powerMin + appliance.powerMax) / 2;
      const runtime = appliance.runtime || appliance.defaultRuntime;
      const energyUsed = (avgPower / 1000) * runtime;
      
      // Use the user's desired start time
      const desiredStartTime = appliance.startTime || 19; // Default to 7 PM
      
      // Find the optimal time within a reasonable flexibility window (±6 hours)
      const flexibilityWindow = 6;
      const searchStart = Math.max(0, desiredStartTime - flexibilityWindow);
      const searchEnd = Math.min(23, desiredStartTime + flexibilityWindow);
      
      let bestTime = desiredStartTime;
      let bestScore = -Infinity;
      let bestSavings = 0;
      let bestEcoPoints = 0;
      
      // Search for the best time slot within the flexibility window
      for (let startHour = searchStart; startHour <= searchEnd; startHour++) {
        // Make sure appliance can finish within the day
        if (startHour + runtime <= 24) {
          // Calculate cost and eco points for this time slot
          const originalBand = ecoBands.find(b => b.hour === desiredStartTime);
          const candidateBand = ecoBands.find(b => b.hour === startHour);
          
          if (originalBand && candidateBand) {
            // Calculate savings (price difference in $/kWh)
            const originalPrice = originalBand.price / 1000; // Convert MWh to kWh
            const candidatePrice = candidateBand.price / 1000;
            const priceDiff = originalPrice - candidatePrice;
            const savings = energyUsed * priceDiff;
            
            // Calculate eco points difference
            const originalPoints = originalBand.points * energyUsed;
            const candidatePoints = candidateBand.points * energyUsed;
            const ecoPointsDiff = candidatePoints - originalPoints;
            
            // Score based on savings and eco points (prioritize savings)
            const score = savings * 2 + ecoPointsDiff * 0.1;
            
            if (score > bestScore) {
              bestScore = score;
              bestTime = startHour;
              bestSavings = Math.max(savings, 0);
              bestEcoPoints = Math.max(ecoPointsDiff, 0);
            }
          }
        }
      }
      
      // Generate reasoning based on the shift
      const originalBand = ecoBands.find(b => b.hour === desiredStartTime);
      const recommendedBand = ecoBands.find(b => b.hour === bestTime);
      
      let reasoning = '';
      if (bestTime === desiredStartTime) {
        reasoning = `Your desired time (${formatTime(desiredStartTime)}) is already optimal! You'll save $${bestSavings.toFixed(2)} and earn ${Math.floor(bestEcoPoints)} EcoPoints.`;
      } else {
        const timeShift = bestTime - desiredStartTime;
        const shiftDirection = timeShift > 0 ? 'later' : 'earlier';
        const shiftAmount = Math.abs(timeShift);
        
        reasoning = `Shift from ${formatTime(desiredStartTime)} to ${formatTime(bestTime)} (${shiftAmount} hour${shiftAmount > 1 ? 's' : ''} ${shiftDirection}) to save $${bestSavings.toFixed(2)} and earn ${Math.floor(bestEcoPoints)} EcoPoints. ${recommendedBand?.band === 'GREEN' ? 'Perfect timing for renewable energy!' : 'Avoids peak pricing during high demand.'}`;
      }

      return {
        appliance: appliance.name,
        icon: appliance.icon,
        originalTime: desiredStartTime,
        recommendedTime: bestTime,
        savings: bestSavings,
        ecoPoints: Math.floor(bestEcoPoints),
        reasoning,
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

  // Helper function to format time
  const formatTime = (hour: number): string => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
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
          <ApplianceSelector
            appliances={appliances}
            onApplianceUpdate={setAppliances}
            onNext={() => setCurrentStep('ecobands')}
          />
        );
      
      case 'ecobands':
        return (
          <EcoBandsTimeline
            onCalculateOptimal={() => setCurrentStep('ai-recommendations')}
          />
        );
      
      case 'ai-recommendations':
        return (
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                🤖 AI-Powered Optimization
              </h2>
              <p className="text-muted-foreground text-lg">
                Gemini AI is analyzing your appliances and eco bands to create the most optimal schedule
              </p>
            </div>
            <GeminiTestButton appliances={appliances} ecoBands={ecoBands} />
            <div className="text-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('results')}
              >
                View Manual Calculation
              </Button>
              <Button 
                onClick={() => {
                  setAppliances(appliances.map(a => ({ ...a, selected: false })));
                  setCurrentStep('welcome');
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        );
      
      case 'results':
        return (
          <ResultsView
            results={calculateOptimalSchedule()}
            onExport={handleExport}
            onStartOver={() => {
              setAppliances(appliances.map(a => ({ ...a, selected: false })));
              setCurrentStep('welcome');
            }}
            appliances={appliances}
            ecoBands={ecoBands}
          />
        );
      
      case 'dashboard':
        return (
          <SavingsDashboard 
            savings={mockSavingsData} 
            onStartOptimization={() => {
              setAppliances(appliances.map(a => ({ ...a, selected: false })));
              setCurrentStep('appliances');
            }}
          />
        );
      
      case 'clock':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Energy Timeline Clock
              </h2>
              <p className="text-muted-foreground text-lg">
                Watch Houston's energy pricing change throughout the day
              </p>
            </div>
            <DualAnalogClock ecoBands={ecoBands} />
          </div>
        );
      
      case 'weather':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Weather-Based Energy Optimization
              </h2>
              <p className="text-muted-foreground text-lg">
                Get AI-powered AC temperature recommendations based on weather and energy pricing
              </p>
            </div>
            <WeatherOptimizer ecoBands={ecoBands} />
          </div>
        );
      
      default:
        return <NotFound />;
    }
  };

  // Calculate current stats for navigation bar
  const currentResults = calculateOptimalSchedule();
  const currentEcoPoints = currentResults.totalEcoPoints;
  const currentSavings = currentResults.totalSavings;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar - show on all pages except welcome */}
      {currentStep !== 'welcome' && (
        <NavigationBar
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          totalEcoPoints={currentEcoPoints}
          totalSavings={currentSavings}
          ecoBands={ecoBands}
        />
      )}
      
      {/* Main Content */}
      <main className={currentStep === 'welcome' ? '' : 'pt-16'}>
        {/* Energy Status Indicator - show only on weather page */}
        {currentStep === 'weather' && (
          <div className="container mx-auto px-4 py-4">
            <EnergyStatusIndicator ecoBands={ecoBands} />
          </div>
        )}
        {renderCurrentStep()}
      </main>
      
      {/* Floating Action Button for Dashboard (only show after welcome) */}
      {currentStep !== 'welcome' && currentStep !== 'dashboard' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setCurrentStep('dashboard')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
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
            totalSavings: currentResults.totalSavings,
            totalEcoPoints: currentResults.totalEcoPoints,
            schedules: currentResults.schedules.map(s => ({
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
      <Route path="/pricing-dashboard" component={PricingDashboardPage} />
      <Route path="/analog-clock" component={AnalogClockPage} />
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