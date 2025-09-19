import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Zap, DollarSign, Sparkles } from "lucide-react";

interface WelcomeHeroProps {
  onGetStarted: () => void;
  onAIGetStarted: () => void;
}

export default function WelcomeHero({ onGetStarted, onAIGetStarted }: WelcomeHeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-chart-2/10 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Content */}
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-chart-3 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            <span className="text-primary">EcoShift</span> — Power Your Savings,
            <br />
            Protect Our Planet
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Shift your load. Support your future. EcoShift helps you lower your bill and lower emissions by shifting appliance usage to greener grid hours.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 hover-elevate" data-testid="card-save-money">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-chart-3/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="font-semibold text-lg">Save Money</h3>
              <p className="text-muted-foreground">
                Reduce your electricity bill by running appliances during cheaper hours
              </p>
            </div>
          </Card>
          
          <Card className="p-6 hover-elevate" data-testid="card-save-energy">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-chart-2" />
              </div>
              <h3 className="font-semibold text-lg">Save Energy</h3>
              <p className="text-muted-foreground">
                Optimize your energy usage with smart timing recommendations
              </p>
            </div>
          </Card>
          
          <Card className="p-6 hover-elevate" data-testid="card-save-earth">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Save the Earth</h3>
              <p className="text-muted-foreground">
                Support renewable energy and reduce carbon emissions
              </p>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto" 
              onClick={onAIGetStarted}
              data-testid="button-ai-get-started"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI Recommendations
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto" 
              onClick={onGetStarted}
              data-testid="button-manual-get-started"
            >
              Manual Shift
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get AI-powered recommendations or manually configure your schedule
          </p>
        </div>
      </div>
    </div>
  );
}