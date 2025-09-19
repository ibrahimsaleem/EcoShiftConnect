import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Zap, DollarSign, Sparkles } from "lucide-react";

interface WelcomeHeroProps {
  onGetStarted: () => void;
}

export default function WelcomeHero({ onGetStarted }: WelcomeHeroProps) {
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
          
          <h1 className="text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">EcoShift</span>
            <br />
            <span className="text-2xl bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">💰 Save Money • 🌱 Save Earth</span>
          </h1>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 hover-elevate bg-gradient-to-br from-green-50 to-emerald-100 border-green-200" data-testid="card-save-money">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-green-700">💵 Save Money</h3>
            </div>
          </Card>
          
          <Card className="p-6 hover-elevate bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200" data-testid="card-save-energy">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-blue-700">⚡ Smart Timing</h3>
            </div>
          </Card>
          
          <Card className="p-6 hover-elevate bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200" data-testid="card-save-earth">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-orange-700">🌍 Save Earth</h3>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <Button 
            size="lg" 
            className="text-xl px-12 py-8 h-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl" 
            onClick={onGetStarted}
            data-testid="button-get-started"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            🚀 Start Now
          </Button>
        </div>
      </div>
    </div>
  );
}