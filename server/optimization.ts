import type { Appliance, EcoBand, OptimizationSummary, OptimizationResult } from '@shared/schema';
import { loadRewardPenaltyData } from './data/csvUtils';

export class EcoShiftOptimizer {
  private ecoBands: EcoBand[] = [];

  constructor() {
    this.ecoBands = loadRewardPenaltyData();
  }

  public getEcoBands(): EcoBand[] {
    return this.ecoBands;
  }

  public optimizeAppliances(
    appliances: Appliance[], 
    preferences?: { prioritizeSavings?: boolean; prioritizeEcoPoints?: boolean; avoidPeakHours?: boolean }
  ): OptimizationSummary {
    const selectedAppliances = appliances.filter(a => a.selected);
    const schedules: OptimizationResult[] = [];

    // Set default preferences
    const prefs = {
      prioritizeSavings: preferences?.prioritizeSavings ?? true,
      prioritizeEcoPoints: preferences?.prioritizeEcoPoints ?? false,
      avoidPeakHours: preferences?.avoidPeakHours ?? true
    };

    for (const appliance of selectedAppliances) {
      const result = this.optimizeSingleAppliance(appliance, prefs);
      if (result) {
        schedules.push(result);
      }
    }

    const totalSavings = schedules.reduce((sum, s) => sum + s.savings, 0);
    const totalEcoPoints = schedules.reduce((sum, s) => sum + s.ecoPoints, 0);
    const totalEnergyShifted = schedules.reduce((sum, s) => sum + s.energyUsed, 0);
    const carbonReduction = totalEnergyShifted * 0.4; // kg CO2 per kWh (rough estimate)

    return {
      totalSavings,
      totalEcoPoints,
      totalEnergyShifted,
      carbonReduction,
      schedules
    };
  }

  private optimizeSingleAppliance(
    appliance: Appliance, 
    preferences: { prioritizeSavings: boolean; prioritizeEcoPoints: boolean; avoidPeakHours: boolean }
  ): OptimizationResult | null {
    const runtime = appliance.runtime || appliance.defaultRuntime;
    const flexHours = appliance.flexHours || 6;
    const avgPower = (appliance.powerMin + appliance.powerMax) / 2;
    const energyUsed = (avgPower / 1000) * runtime; // Convert to kWh

    // Find the current/typical start time (default to evening peak if not specified)
    const originalTime = appliance.startTime || this.getTypicalStartTime(appliance.name);

    // Find optimal time within flexibility window
    const optimalTime = this.findOptimalTimeSlot(runtime, flexHours, originalTime, preferences);

    if (optimalTime === null) {
      return null;
    }

    // Calculate savings and points
    const originalCost = this.calculateCost(originalTime, energyUsed, runtime);
    const optimizedCost = this.calculateCost(optimalTime, energyUsed, runtime);
    const savings = Math.max(originalCost.cost - optimizedCost.cost, 0);
    const ecoPoints = Math.floor(optimizedCost.points - originalCost.points);

    // Generate reasoning
    const reasoning = this.generateReasoning(appliance, originalTime, optimalTime, savings, ecoPoints);

    return {
      appliance: appliance.name,
      originalTime,
      recommendedTime: optimalTime,
      savings,
      ecoPoints: Math.max(ecoPoints, 0),
      reasoning,
      energyUsed
    };
  }

  private findOptimalTimeSlot(
    runtime: number, 
    flexHours: number, 
    preferredStart: number,
    preferences: { prioritizeSavings: boolean; prioritizeEcoPoints: boolean; avoidPeakHours: boolean }
  ): number | null {
    let bestTime = preferredStart;
    let bestScore = -Infinity;

    // Search within flexibility window
    const searchStart = Math.max(0, preferredStart - flexHours);
    const searchEnd = Math.min(23, preferredStart + flexHours);

    for (let startHour = searchStart; startHour <= searchEnd; startHour++) {
      // Make sure appliance can finish within the day
      if (startHour + runtime <= 24) {
        const score = this.calculateTimeSlotScore(startHour, runtime, preferences);
        if (score > bestScore) {
          bestScore = score;
          bestTime = startHour;
        }
      }
    }

    return bestTime;
  }

  private calculateTimeSlotScore(
    startHour: number, 
    runtime: number,
    preferences: { prioritizeSavings: boolean; prioritizeEcoPoints: boolean; avoidPeakHours: boolean }
  ): number {
    let totalScore = 0;
    let hoursToCheck = Math.ceil(runtime);

    for (let i = 0; i < hoursToCheck; i++) {
      const hour = (startHour + i) % 24;
      const band = this.ecoBands.find(b => b.hour === hour);
      
      if (band) {
        // Base score from band type
        let bandScore = 0;
        switch (band.band) {
          case 'GREEN': bandScore = 100; break;
          case 'BLUE': bandScore = 50; break;
          case 'ORANGE': bandScore = 10; break;
          case 'RED': bandScore = -100; break;
        }
        
        // Price-based score (lower price = higher score)
        const priceScore = Math.max(0, 100 - band.price);
        
        // Points-based score
        const pointsScore = band.points * 10;
        
        // Apply user preference weights
        let weightedScore = bandScore;
        
        if (preferences.prioritizeSavings) {
          weightedScore += priceScore * 2; // Double weight for cost savings
          weightedScore += band.credit * 1000; // Amplify credit benefits
        }
        
        if (preferences.prioritizeEcoPoints) {
          weightedScore += pointsScore * 3; // Triple weight for eco points
        }
        
        if (preferences.avoidPeakHours && band.band === 'RED') {
          weightedScore -= 200; // Heavy penalty for RED periods
        }
        
        totalScore += weightedScore;
      }
    }

    return totalScore / hoursToCheck;
  }

  private calculateCost(startHour: number, energyKwh: number, runtime: number = 1): { cost: number; points: number } {
    let totalCost = 0;
    let totalPoints = 0;
    
    // Calculate energy usage per hour (assuming even distribution)
    const energyPerHour = energyKwh / runtime;
    const hoursToCheck = Math.ceil(runtime);

    // Integrate costs and points across the full runtime period
    for (let i = 0; i < hoursToCheck; i++) {
      const hour = (startHour + i) % 24;
      const band = this.ecoBands.find(b => b.hour === hour);
      
      if (band) {
        // Determine the fraction of this hour that the appliance runs
        let hourFraction = 1;
        if (i === hoursToCheck - 1 && runtime % 1 !== 0) {
          // Last partial hour
          hourFraction = runtime % 1;
        }
        
        const energyThisHour = energyPerHour * hourFraction;
        
        // Convert price from $/MWh to $/kWh
        const pricePerKwh = band.price / 1000;
        let hourlyCost = energyThisHour * pricePerKwh;
        
        // Apply credits/penalties
        hourlyCost -= energyThisHour * band.credit;
        
        // Calculate points for this hour
        const hourlyPoints = energyThisHour * band.points;
        
        totalCost += hourlyCost;
        totalPoints += hourlyPoints;
      }
    }

    return { cost: Math.max(totalCost, 0), points: totalPoints };
  }

  private getTypicalStartTime(applianceName: string): number {
    const name = applianceName.toLowerCase();
    
    // Typical usage patterns
    if (name.includes('ev') || name.includes('electric vehicle')) return 18; // Evening
    if (name.includes('dishwasher')) return 20; // After dinner
    if (name.includes('dryer') || name.includes('washer')) return 19; // Evening
    if (name.includes('water heater')) return 17; // Before peak
    if (name.includes('ac') || name.includes('air conditioner')) return 14; // Afternoon
    if (name.includes('lighting') || name.includes('light')) return 18; // Evening
    if (name.includes('tv')) return 20; // Prime time
    
    return 18; // Default to evening peak
  }

  private generateReasoning(
    appliance: Appliance, 
    originalTime: number, 
    optimalTime: number, 
    savings: number,
    ecoPoints: number
  ): string {
    const originalBand = this.ecoBands.find(b => b.hour === originalTime);
    const optimalBand = this.ecoBands.find(b => b.hour === optimalTime);
    
    if (!originalBand || !optimalBand) {
      return "Optimized timing for better energy efficiency and cost savings.";
    }

    let reasoning = "";
    
    // Time period description
    if (optimalTime >= 2 && optimalTime <= 5) {
      reasoning += "Shift to overnight green hours ";
    } else if (optimalTime >= 8 && optimalTime <= 11) {
      reasoning += "Run during solar surplus hours ";
    } else if (optimalTime >= 12 && optimalTime <= 14) {
      reasoning += "Schedule for midday period ";
    } else {
      reasoning += "Optimize timing ";
    }

    // Benefits
    if (optimalBand.band === 'GREEN') {
      reasoning += "to take advantage of renewable energy and low prices. ";
    } else if (originalBand.band === 'RED' && optimalBand.band !== 'RED') {
      reasoning += "to avoid peak pricing and grid stress. ";
    }

    // Specific appliance benefits
    if (appliance.name.toLowerCase().includes('ev')) {
      reasoning += "Your EV will be fully charged by morning while supporting clean energy.";
    } else if (appliance.name.toLowerCase().includes('dishwasher')) {
      reasoning += "Perfect timing for clean dishes with clean power.";
    } else if (appliance.name.toLowerCase().includes('dryer')) {
      reasoning += "Your clothes will be ready while supporting the grid.";
    } else {
      reasoning += "Great timing for eco-friendly operation.";
    }

    return reasoning;
  }
}