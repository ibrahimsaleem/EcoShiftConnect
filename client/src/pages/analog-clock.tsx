import DualAnalogClock from "@/components/DualAnalogClock";
import type { EcoBand } from "@shared/schema";

// Mock eco bands data (same as in App.tsx)
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

export default function AnalogClockPage() {
  return (
    <div className="min-h-screen bg-background">
      <DualAnalogClock ecoBands={ecoBands} />
    </div>
  );
}
