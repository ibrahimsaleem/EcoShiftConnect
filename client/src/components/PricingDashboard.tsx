import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  TrendingUp, TrendingDown, Clock, DollarSign, Leaf, 
  Zap, AlertTriangle, CheckCircle, Info
} from "lucide-react";
import type { EcoBand } from "@shared/schema";

interface PricingDashboardProps {
  ecoBands: EcoBand[];
}

export default function PricingDashboard({ ecoBands }: PricingDashboardProps) {
  // Prepare data for different chart types
  const chartData = ecoBands.map(band => ({
    hour: band.hour,
    time: formatTime(band.hour),
    price: band.price / 1000, // Convert MWh to kWh
    credit: band.credit,
    points: band.points,
    band: band.band,
    description: band.description,
    // Color coding for bands
    color: getBandColor(band.band),
    // Peak classification
    isPeak: band.band === 'RED' || band.band === 'ORANGE',
    isOptimal: band.band === 'GREEN',
    // Savings potential (compared to average)
    savingsPotential: calculateSavingsPotential(band.price, ecoBands)
  }));

  // Summary statistics
  const stats = {
    avgPrice: ecoBands.reduce((sum, b) => sum + b.price, 0) / ecoBands.length / 1000,
    minPrice: Math.min(...ecoBands.map(b => b.price)) / 1000,
    maxPrice: Math.max(...ecoBands.map(b => b.price)) / 1000,
    greenHours: ecoBands.filter(b => b.band === 'GREEN').length,
    redHours: ecoBands.filter(b => b.band === 'RED').length,
    totalSavingsPotential: ecoBands.reduce((sum, b) => sum + calculateSavingsPotential(b.price, ecoBands), 0)
  };

  // Peak hours analysis
  const peakHours = ecoBands.filter(b => b.band === 'RED' || b.band === 'ORANGE');
  const optimalHours = ecoBands.filter(b => b.band === 'GREEN');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Energy Pricing Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Visualize hourly pricing, peak hours, and eco-friendly time slots
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Price</p>
              <p className="text-xl font-bold">${stats.avgPrice.toFixed(3)}/kWh</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Lowest Price</p>
              <p className="text-xl font-bold">${stats.minPrice.toFixed(3)}/kWh</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Highest Price</p>
              <p className="text-xl font-bold">${stats.maxPrice.toFixed(3)}/kWh</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Green Hours</p>
              <p className="text-xl font-bold">{stats.greenHours}/24</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pricing">Hourly Pricing</TabsTrigger>
          <TabsTrigger value="bands">Eco Bands</TabsTrigger>
          <TabsTrigger value="peaks">Peak Analysis</TabsTrigger>
          <TabsTrigger value="savings">Savings Potential</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Hourly Pricing Chart */}
        <TabsContent value="pricing">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">24-Hour Energy Pricing</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval={1}
                />
                <YAxis 
                  label={{ value: 'Price ($/kWh)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">Price: ${data.price.toFixed(3)}/kWh</p>
                          <p className="text-sm">Band: <Badge variant="outline" className="ml-1">{data.band}</Badge></p>
                          <p className="text-sm">Credit: ${data.credit.toFixed(3)}/kWh</p>
                          <p className="text-sm">Points: {data.points}</p>
                          <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="price" 
                  radius={[2, 2, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Eco Bands Timeline */}
        <TabsContent value="bands">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Eco Bands Timeline</h3>
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">GREEN - Optimal (Low Cost, High Rewards)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">BLUE - Neutral (Moderate Cost)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">ORANGE - Caution (Higher Cost)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">RED - Avoid (Peak Cost, Penalties)</span>
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="relative">
                <div className="flex h-12 rounded-lg overflow-hidden border border-border">
                  {chartData.map((hour) => (
                    <div
                      key={hour.hour}
                      className="flex-1 flex items-center justify-center relative group cursor-pointer"
                      style={{ backgroundColor: hour.color }}
                      title={`${hour.time}: ${hour.band} - $${hour.price.toFixed(3)}/kWh`}
                    >
                      <span className="text-xs font-medium text-white mix-blend-difference">
                        {hour.hour}
                      </span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-background border border-border rounded-lg p-2 shadow-lg text-xs whitespace-nowrap">
                          <p className="font-medium">{hour.time}</p>
                          <p>Band: {hour.band}</p>
                          <p>Price: ${hour.price.toFixed(3)}/kWh</p>
                          <p>Credit: ${hour.credit.toFixed(3)}/kWh</p>
                          <p>Points: {hour.points}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Time Labels */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>12 AM</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Peak Hours Analysis */}
        <TabsContent value="peaks">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours Chart */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Peak Hours Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Peak Hours List */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Peak Hours to Avoid</h3>
              <div className="space-y-3">
                {peakHours.map((hour) => (
                  <div key={hour.hour} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="font-medium">{formatTime(hour.hour)}</p>
                        <p className="text-sm text-muted-foreground">{hour.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">${(hour.price/1000).toFixed(3)}/kWh</p>
                      <Badge variant="destructive" className="text-xs">
                        {hour.band}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Savings Potential */}
        <TabsContent value="savings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Savings Chart */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Savings Potential by Hour</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="savingsPotential" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Optimal Hours */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Best Hours for Appliances</h3>
              <div className="space-y-3">
                {optimalHours.map((hour) => (
                  <div key={hour.hour} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium">{formatTime(hour.hour)}</p>
                        <p className="text-sm text-muted-foreground">{hour.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${(hour.price/1000).toFixed(3)}/kWh</p>
                      <p className="text-sm text-green-600">+{hour.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Band Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Eco Band Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'GREEN', value: stats.greenHours, color: '#10b981' },
                      { name: 'BLUE', value: ecoBands.filter(b => b.band === 'BLUE').length, color: '#3b82f6' },
                      { name: 'ORANGE', value: ecoBands.filter(b => b.band === 'ORANGE').length, color: '#f97316' },
                      { name: 'RED', value: stats.redHours, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}h`}
                  >
                    {[
                      { name: 'GREEN', value: stats.greenHours, color: '#10b981' },
                      { name: 'BLUE', value: ecoBands.filter(b => b.band === 'BLUE').length, color: '#3b82f6' },
                      { name: 'ORANGE', value: ecoBands.filter(b => b.band === 'ORANGE').length, color: '#f97316' },
                      { name: 'RED', value: stats.redHours, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Price Range Analysis */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Price Range Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Price Range</span>
                  <span className="font-medium">${stats.minPrice.toFixed(3)} - ${stats.maxPrice.toFixed(3)}/kWh</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Average Price</span>
                  <span className="font-medium">${stats.avgPrice.toFixed(3)}/kWh</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Price Variance</span>
                  <span className="font-medium">{((stats.maxPrice - stats.minPrice) / stats.avgPrice * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Optimal Hours</span>
                  <span className="font-medium text-green-600">{stats.greenHours}/24 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Peak Hours</span>
                  <span className="font-medium text-red-600">{stats.redHours}/24 hours</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions
function formatTime(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function getBandColor(band: string): string {
  switch (band) {
    case 'GREEN': return '#10b981';
    case 'BLUE': return '#3b82f6';
    case 'ORANGE': return '#f97316';
    case 'RED': return '#ef4444';
    default: return '#6b7280';
  }
}

function calculateSavingsPotential(price: number, allBands: EcoBand[]): number {
  const avgPrice = allBands.reduce((sum, b) => sum + b.price, 0) / allBands.length;
  return Math.max(0, (avgPrice - price) / 1000); // Convert to $/kWh
}
