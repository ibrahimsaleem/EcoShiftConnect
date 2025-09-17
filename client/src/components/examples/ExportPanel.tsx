import { useState } from 'react';
import ExportPanel, { type ExportData } from '../ExportPanel';
import { Button } from "@/components/ui/button";

export default function ExportPanelExample() {
  const [showExport, setShowExport] = useState(false);

  const mockExportData: ExportData = {
    totalSavings: 18.75,
    totalEcoPoints: 145,
    schedules: [
      {
        appliance: "Electric Vehicle",
        originalTime: 18,
        recommendedTime: 2,
        savings: 12.40,
        ecoPoints: 90
      },
      {
        appliance: "Dishwasher", 
        originalTime: 19,
        recommendedTime: 10,
        savings: 3.25,
        ecoPoints: 18
      },
      {
        appliance: "Clothes Dryer",
        originalTime: 20,
        recommendedTime: 9,
        savings: 2.85,
        ecoPoints: 25
      }
    ],
    summary: "By shifting your appliances to greener hours, you're supporting renewable energy and reducing grid stress during peak demand periods. Every shifted hour is a step toward a greener future!"
  };

  return (
    <div className="p-6">
      <Button onClick={() => setShowExport(true)}>
        Show Export Panel
      </Button>
      
      {showExport && (
        <ExportPanel 
          data={mockExportData}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}