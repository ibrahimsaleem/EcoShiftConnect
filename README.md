# 🌱 EcoShiftConnect

**Power Your Savings, Protect Our Planet**

EcoShiftConnect is a beautiful, engaging web application that helps households save money and support a greener grid through intelligent load shifting. By analyzing real-time electricity pricing and eco-friendly time bands, the app recommends optimal scheduling for your appliances to maximize savings and minimize environmental impact.

## ✨ Features

### 🏠 Smart Appliance Management
- **Comprehensive Appliance Catalog**: EV, Dishwasher, Dryer, Washer, Water Heater, AC, LED Lighting, Smart TV
- **Power Consumption Tracking**: Real-time wattage monitoring and energy usage calculations
- **Flexible Scheduling**: Customizable runtime and start time preferences
- **Constraint Management**: Quiet hours and user-specific limitations

### 📊 Eco-Friendly Time Bands
- **24-Hour Visual Timeline**: Color-coded bands (GREEN, BLUE, ORANGE, RED) showing optimal usage periods
- **Real-Time Pricing**: Houston market data integration with hourly electricity rates
- **Reward System**: EcoPoints and credits for shifting usage to green hours
- **Environmental Impact**: CO₂ reduction tracking and carbon footprint visualization

### 💰 Savings & Gamification
- **Cost Optimization**: Automatic calculation of potential savings through load shifting
- **EcoPoints System**: Gamified rewards for sustainable energy practices
- **Achievement Badges**: Progress tracking with levels like "Eco Hero" and "Planet Protector"
- **Savings Dashboard**: Comprehensive overview of financial and environmental benefits

### 🎨 Beautiful User Experience
- **Modern Design**: Clean, eco-friendly interface with forest green and ocean blue color palette
- **Responsive Layout**: Mobile-first design with smooth animations and transitions
- **Interactive Components**: Analog clocks, timeline visualizations, and real-time status indicators
- **Export Functionality**: CSV/JSON export for detailed analysis and sharing

### 🤖 AI-Powered Insights
- **Gemini Integration**: Natural language recommendations for optimal appliance scheduling
- **Weather Optimization**: Weather-aware energy planning for enhanced efficiency
- **Smart Reasoning**: Detailed explanations for scheduling recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahimsaleem/EcoShiftConnect.git
   cd EcoShiftConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to see EcoShiftConnect in action!

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Deployment on Render

EcoShiftConnect can be easily deployed on [Render](https://render.com):

1. Connect your GitHub repository to Render
2. Use the following settings:
   - **Build Command**: `npm install; npm run build`
   - **Start Command**: `npm run start:render`
   - **Environment Variables**:
     - `GEMINI_API_KEY`: For AI recommendations
     - `OPENWEATHER_API_KEY`: (Optional) For real weather data

For detailed instructions, see [render-deployment.md](render-deployment.md)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **TailwindCSS** for modern, responsive styling
- **Radix UI** components for accessible, beautiful interfaces
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database management
- **Google Gemini AI** for intelligent recommendations
- **WebSocket** support for real-time updates

### Development Tools
- **Vite** for fast development and building
- **ESBuild** for optimized production builds
- **TypeScript** for type safety
- **PostCSS** with Autoprefixer

## 📁 Project Structure

```
EcoShiftConnect/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express.js backend
│   ├── routes/            # API route handlers
│   ├── data/              # Data processing utilities
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
├── attached_assets/       # Sample data files
└── dist/                  # Production build output
```

## 🎯 Core Functionality

### Load Shifting Algorithm
1. **Data Collection**: User appliance preferences and usage patterns
2. **Price Analysis**: Real-time electricity pricing from Houston market data
3. **Optimization**: Algorithm finds optimal scheduling within user flexibility windows
4. **Recommendations**: AI-powered suggestions with detailed reasoning
5. **Impact Tracking**: Savings calculation and environmental benefit measurement

### Eco Band System
- **GREEN**: Optimal periods with renewable energy surplus and rewards
- **BLUE**: Neutral periods with standard pricing
- **ORANGE**: High demand periods requiring caution
- **RED**: Peak stress periods to avoid with penalty pricing

## 📊 Sample Data

The application includes sample datasets:
- `Houston_pricing_data.csv`: Hourly electricity market prices
- `reward_penalty_windows.csv`: Eco band definitions with credits and points
- `appliance_power_catalog.csv`: Appliance specifications and power consumption

## 🌍 Environmental Impact

EcoShiftConnect helps users:
- **Reduce Carbon Footprint**: Shift usage to renewable energy periods
- **Support Grid Stability**: Avoid peak demand stress periods
- **Save Money**: Optimize electricity costs through intelligent scheduling
- **Build Awareness**: Understand energy consumption patterns and environmental impact

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Houston electricity market data for realistic pricing scenarios
- Google Gemini AI for intelligent recommendations
- The open-source community for the amazing tools and libraries

## 📞 Support

For support, email support@ecoshiftconnect.com or join our community discussions.

---

**EcoShiftConnect** — because every shifted hour is a step toward a greener future. 🌱⚡

*Save Money. Save Energy. Save the Earth.*
