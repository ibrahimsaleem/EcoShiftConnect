import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Zap, 
  BarChart3, 
  Settings, 
  Leaf,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Clock,
  Cloud
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export type AppStep = 'welcome' | 'ai-recommendations' | 'appliances' | 'ecobands' | 'results' | 'dashboard' | 'clock' | 'weather';

interface NavigationBarProps {
  currentStep: AppStep;
  onStepChange: (step: AppStep) => void;
  totalEcoPoints?: number;
  totalSavings?: number;
  ecoBands?: any[];
}

const navigationItems = [
  {
    id: 'welcome' as AppStep,
    label: 'Home',
    icon: Home,
    description: 'Start'
  },
  {
    id: 'appliances' as AppStep,
    label: 'Setup',
    icon: Zap,
    description: 'Configure'
  },
  {
    id: 'results' as AppStep,
    label: 'Optimize',
    icon: BarChart3,
    description: 'AI Results'
  },
  {
    id: 'dashboard' as AppStep,
    label: 'Dashboard',
    icon: Settings,
    description: 'Stats'
  }
];

export default function NavigationBar({ 
  currentStep, 
  onStepChange, 
  totalEcoPoints = 0, 
  totalSavings = 0,
  ecoBands = []
}: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentIndex = navigationItems.findIndex(item => item.id === currentStep);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < navigationItems.length - 1;

  const handlePrevious = () => {
    if (canGoBack) {
      onStepChange(navigationItems[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      onStepChange(navigationItems[currentIndex + 1].id);
    }
  };

  const handleNavigation = (step: AppStep) => {
    onStepChange(step);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">EcoShift</h1>
                <p className="text-xs text-muted-foreground">Smart Energy Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentStep === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center space-x-4">
            {/* Eco Points Badge */}
            {totalEcoPoints > 0 && (
              <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
                <Leaf className="h-3 w-3" />
                <span>{totalEcoPoints} pts</span>
              </Badge>
            )}

            {/* Savings Badge */}
            {totalSavings > 0 && (
              <Badge variant="outline" className="hidden sm:flex items-center space-x-1">
                <span className="text-green-600">${totalSavings.toFixed(2)}</span>
              </Badge>
            )}

            {/* Navigation Controls */}
            <div className="hidden sm:flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={!canGoBack}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!canGoForward}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Energy Status Indicator */}
            {ecoBands.length > 0 && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
                <Activity className="h-4 w-4" />
                <div className="text-sm">
                  <div className="font-medium">
                    ${(ecoBands[new Date().getHours()]?.price / 1000 || 0).toFixed(3)}/kWh
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ecoBands[new Date().getHours()]?.band || 'N/A'} Band
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Dashboard Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/pricing-dashboard', '_blank')}
              className="hidden sm:flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Pricing</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Leaf className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">EcoShift</h2>
                      <p className="text-sm text-muted-foreground">Smart Energy Management</p>
                    </div>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentStep === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start space-x-3"
                          onClick={() => handleNavigation(item.id)}
                        >
                          <Icon className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Mobile Stats */}
                  {(totalEcoPoints > 0 || totalSavings > 0) && (
                    <div className="pt-4 border-t space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Your Progress</h3>
                      {totalEcoPoints > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Eco Points</span>
                          <Badge variant="secondary">
                            <Leaf className="h-3 w-3 mr-1" />
                            {totalEcoPoints}
                          </Badge>
                        </div>
                      )}
                      {totalSavings > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Savings</span>
                          <Badge variant="outline" className="text-green-600">
                            ${totalSavings.toFixed(2)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing Dashboard Link */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full justify-start space-x-3"
                      onClick={() => {
                        window.open('/pricing-dashboard', '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Pricing Dashboard</div>
                        <div className="text-xs text-muted-foreground">View detailed pricing charts</div>
                      </div>
                    </Button>
                  </div>

                  {/* Mobile Navigation Controls */}
                  <div className="pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={!canGoBack}
                        className="flex-1"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={!canGoForward}
                        className="flex-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
