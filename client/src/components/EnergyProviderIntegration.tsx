import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Leaf, 
  DollarSign, 
  Clock, 
  Car, 
  Home, 
  SunMedium, 
  Battery, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Star,
  ThermometerSun
} from "lucide-react";

export default function EnergyProviderIntegration() {
  const [zipCode, setZipCode] = useState("");
  const [energyUsage, setEnergyUsage] = useState(1000);
  const [hasSmartThermostat, setHasSmartThermostat] = useState(false);
  const [hasEV, setHasEV] = useState(false);
  const [hasSolar, setHasSolar] = useState(false);
  const [hasBattery, setHasBattery] = useState(false);
  const [email, setEmail] = useState("");
  const [showPlans, setShowPlans] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPlans(true);
  };

  const energyPlans = [
    {
      name: "EcoShift Basic",
      type: "Fixed Rate",
      duration: "12 months",
      rate: 10.9,
      monthlyEstimate: Math.round(energyUsage * 0.109),
      features: ["100% Renewable Energy", "Smart Home Integration", "EcoShift App Access"],
      recommended: false,
      color: "green"
    },
    {
      name: "EcoShift Flex",
      type: "Time of Use",
      duration: "12 months",
      rate: { peak: 12.4, offPeak: 8.3 },
      monthlyEstimate: Math.round(energyUsage * 0.103),
      features: ["100% Renewable Energy", "Smart Home Integration", "EcoShift App Access", "Off-peak Savings", "AI Load Shifting"],
      recommended: true,
      color: "blue"
    },
    {
      name: "EcoShift EV",
      type: "EV Optimized",
      duration: "12 months",
      rate: 11.5,
      monthlyEstimate: Math.round(energyUsage * 0.115),
      features: ["100% Renewable Energy", "Smart Home Integration", "EcoShift App Access", "EV Charging Optimization", "Smart Charging Scheduler"],
      recommended: hasEV,
      color: "purple"
    },
    {
      name: "EcoShift Solar+",
      type: "Solar Optimized",
      duration: "12 months",
      rate: 12.2,
      monthlyEstimate: Math.round(energyUsage * 0.122),
      features: ["100% Renewable Energy", "Smart Home Integration", "EcoShift App Access", "Solar Production Monitoring", "Export Credits"],
      recommended: hasSolar,
      color: "amber"
    }
  ];

  const partnerProviders = [
    { name: "Octopus Energy", logo: "🐙" },
    { name: "Green Mountain", logo: "🏔️" },
    { name: "Constellation", logo: "✨" },
    { name: "Reliant", logo: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-12">
          <h1 className="text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Smart Energy Plans
            </span>
            <br />
            <span className="text-2xl bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
              💰 Save More with EcoShift Integration
            </span>
          </h1>
          
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Connect EcoShift with your energy provider for smarter savings, automated load shifting, 
            and personalized recommendations that work with your provider's rate plans.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="py-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Works with Leading Energy Providers</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {partnerProviders.map((provider, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white/50 px-6 py-3 rounded-full shadow-sm">
                <span className="text-3xl">{provider.logo}</span>
                <span className="font-medium">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Finder Form */}
        <Card className="p-8 bg-gradient-to-r from-background to-primary/5">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Find Your Perfect Plan</h2>
              <p className="text-muted-foreground mb-6">
                Tell us about your energy usage and smart home devices to get personalized recommendations
                that work with EcoShift's optimization technology.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="zipCode">Where do you live?</Label>
                  <Input 
                    id="zipCode" 
                    placeholder="Enter ZIP code" 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>How much energy do you use monthly?</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">500 kWh</span>
                    <span className="font-medium text-lg">{energyUsage} kWh</span>
                    <span className="text-muted-foreground">2000 kWh</span>
                  </div>
                  <Slider 
                    defaultValue={[1000]} 
                    max={2000} 
                    min={500} 
                    step={50} 
                    onValueChange={(value) => setEnergyUsage(value[0])}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Do you own any of the following?</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Switch 
                        id="smartThermostat" 
                        checked={hasSmartThermostat} 
                        onCheckedChange={setHasSmartThermostat}
                      />
                      <Label htmlFor="smartThermostat" className="flex items-center">
                        <ThermometerSun className="w-4 h-4 mr-2" />
                        Smart Thermostat
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch 
                        id="ev" 
                        checked={hasEV} 
                        onCheckedChange={setHasEV}
                      />
                      <Label htmlFor="ev" className="flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Electric Vehicle
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch 
                        id="solar" 
                        checked={hasSolar} 
                        onCheckedChange={setHasSolar}
                      />
                      <Label htmlFor="solar" className="flex items-center">
                        <SunMedium className="w-4 h-4 mr-2" />
                        Solar Panels
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch 
                        id="battery" 
                        checked={hasBattery} 
                        onCheckedChange={setHasBattery}
                      />
                      <Label htmlFor="battery" className="flex items-center">
                        <Battery className="w-4 h-4 mr-2" />
                        Storage Battery
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="email">Send a copy to your inbox (optional)</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find My Smart Energy Plan
                </Button>
              </form>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="bg-white/60 rounded-lg p-6 shadow-lg border border-primary/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Why Connect EcoShift?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Save up to 23% on energy bills</p>
                      <p className="text-sm text-muted-foreground">Smart load shifting to off-peak hours</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Optimize EV charging costs</p>
                      <p className="text-sm text-muted-foreground">Charge when electricity is cheapest and greenest</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Leaf className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Maximize renewable energy usage</p>
                      <p className="text-sm text-muted-foreground">Automatically use more energy when renewables are abundant</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Real-time energy insights</p>
                      <p className="text-sm text-muted-foreground">See when energy is cleanest and cheapest</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Plan Comparison */}
        {showPlans && (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-2">Recommended Energy Plans</h2>
            <p className="text-center text-muted-foreground mb-8">
              All plans include EcoShift integration for smart energy management
            </p>
            
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="prepay">Prepay</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="pt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {energyPlans.map((plan, index) => (
                    <Card 
                      key={index} 
                      className={`overflow-hidden ${
                        plan.recommended ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                    >
                      {plan.recommended && (
                        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                          Recommended for You
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground">{plan.type} • {plan.duration}</p>
                          </div>
                          {plan.color === "green" && <Leaf className="w-5 h-5 text-green-600" />}
                          {plan.color === "blue" && <Clock className="w-5 h-5 text-blue-600" />}
                          {plan.color === "purple" && <Car className="w-5 h-5 text-purple-600" />}
                          {plan.color === "amber" && <SunMedium className="w-5 h-5 text-amber-600" />}
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-3xl font-bold">${plan.monthlyEstimate}</p>
                          <p className="text-sm text-muted-foreground">
                            monthly estimate for {energyUsage} kWh
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          {typeof plan.rate === 'number' ? (
                            <Badge variant="outline">
                              Unit cost: {plan.rate}¢/kWh
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <Badge variant="outline">
                                On-peak: {plan.rate.peak}¢/kWh
                              </Badge>
                              <Badge variant="outline" className="bg-primary/5">
                                Off-peak: {plan.rate.offPeak}¢/kWh
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2 mb-6">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center">
                              <Check className="w-4 h-4 mr-2 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={`w-full ${
                            plan.recommended 
                              ? 'bg-gradient-to-r from-green-600 to-blue-600' 
                              : ''
                          }`}
                        >
                          Select Plan
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="prepay" className="pt-6">
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Prepay plans coming soon! Check back later for more options.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* EcoShift Integration Benefits */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                How EcoShift Makes Your Energy Smarter
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our technology works with your energy provider to optimize your energy usage,
              reduce costs, and increase your renewable energy consumption.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Smart Bill Optimization</h3>
                </div>
                <p className="text-green-700 flex-grow">
                  EcoShift analyzes your energy provider's rate structure and automatically shifts your 
                  appliance usage to the cheapest times, saving you money without changing your lifestyle.
                </p>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2 text-green-600" />
                    Average savings: $240/year
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">Time-of-Use Mastery</h3>
                </div>
                <p className="text-blue-700 flex-grow">
                  Perfect for time-of-use plans like Octopus Flex. EcoShift automatically schedules your 
                  appliances during off-peak hours when electricity is cheapest and cleanest.
                </p>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2 text-blue-600" />
                    Up to 40% off-peak usage increase
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-md mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">AI-Powered Recommendations</h3>
                </div>
                <p className="text-purple-700 flex-grow">
                  Our AI analyzes your usage patterns and provider's rates to create personalized 
                  recommendations that maximize savings and minimize environmental impact.
                </p>
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2 text-purple-600" />
                    Personalized for your lifestyle
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/20 to-chart-2/20">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Energy?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Connect EcoShift with your energy provider for smarter savings, automated load shifting,
              and personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
