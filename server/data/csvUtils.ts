import * as fs from 'fs';
import * as path from 'path';
import type { EcoBand } from '@shared/schema';

export interface HoustonPricingRow {
  ercot_spp_id: string;
  interval_start_local: string;
  interval_end_local: string;
  curve_name: string;
  region: string;
  price_usd_mwh: number;
  spp_source: string;
  peak: string;
}

export interface RewardPenaltyRow {
  hour: number;
  avg_market_price_usd_mwh: number;
  avg_consumption_kwh: number;
  avg_solar_kwh: number;
  avg_net_load_kwh: number;
  price_band: string;
  credit_usd_per_kwh: number;
  points_per_kwh: number;
  solar_bonus: number;
  total_credit_usd_per_kwh: number;
}

export interface ApplianceRow {
  appliance: string;
  minimum: string;
  maximum: string;
  standby: string;
  other_names: string;
  references: string;
  notes: string;
}

function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
}

export function loadHoustonPricingData(): HoustonPricingRow[] {
  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'Houston_pricing_data_1758135439642.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(csvContent);
    
    // Skip header row
    return rows.slice(1).map(row => ({
      ercot_spp_id: row[0] || '',
      interval_start_local: row[1] || '',
      interval_end_local: row[2] || '',
      curve_name: row[3] || '',
      region: row[4] || '',
      price_usd_mwh: parseFloat(row[5]) || 0,
      spp_source: row[6] || '',
      peak: row[7] || ''
    }));
  } catch (error) {
    console.error('Error loading Houston pricing data:', error);
    return [];
  }
}

export function loadRewardPenaltyData(): EcoBand[] {
  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'reward_penalty_windows_1758135439641.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(csvContent);
    
    // Skip header row
    return rows.slice(1).map(row => {
      const band = row[5] || '';
      let bandType: 'GREEN' | 'BLUE' | 'ORANGE' | 'RED' = 'BLUE';
      
      if (band.includes('GREEN')) bandType = 'GREEN';
      else if (band.includes('ORANGE')) bandType = 'ORANGE';
      else if (band.includes('RED')) bandType = 'RED';
      else bandType = 'BLUE';
      
      return {
        hour: parseInt(row[0]) || 0,
        band: bandType,
        price: parseFloat(row[1]) || 0,
        credit: parseFloat(row[6]) || 0,
        points: parseFloat(row[7]) || 0,
        description: getBandDescription(bandType, parseFloat(row[1]) || 0)
      };
    });
  } catch (error) {
    console.error('Error loading reward penalty data:', error);
    // Return fallback data based on typical patterns
    return generateFallbackEcoBands();
  }
}

export function loadApplianceCatalog(): ApplianceRow[] {
  try {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'appliance_power_catalog_1758135439640.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(csvContent);
    
    // Skip header row
    return rows.slice(1).map(row => ({
      appliance: row[0] || '',
      minimum: row[1] || '',
      maximum: row[2] || '',
      standby: row[3] || '',
      other_names: row[4] || '',
      references: row[5] || '',
      notes: row[6] || ''
    }));
  } catch (error) {
    console.error('Error loading appliance catalog:', error);
    return [];
  }
}

function getBandDescription(band: 'GREEN' | 'BLUE' | 'ORANGE' | 'RED', price: number): string {
  switch (band) {
    case 'GREEN':
      return price < 20 ? 'High solar generation - perfect time!' : 'Great time for eco-friendly appliances';
    case 'BLUE':
      return 'Neutral period with moderate demand';
    case 'ORANGE':
      return 'Grid stress building - use with caution';
    case 'RED':
      return 'Peak demand - avoid usage to save money';
    default:
      return 'Standard pricing period';
  }
}

function generateFallbackEcoBands(): EcoBand[] {
  const bands: EcoBand[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    let band: 'GREEN' | 'BLUE' | 'ORANGE' | 'RED' = 'BLUE';
    let credit = 0.02;
    let points = 1;
    let price = 30;
    
    // Green hours: 2-4 AM (overnight), 8-11 AM (solar)
    if ((hour >= 2 && hour <= 4) || (hour >= 8 && hour <= 11)) {
      band = 'GREEN';
      credit = 0.05;
      points = 3;
      price = 20;
    }
    // Red hours: 6-9 PM (peak demand)
    else if (hour >= 18 && hour <= 21) {
      band = 'RED';
      credit = -0.05;
      points = -2;
      price = 50;
    }
    // Orange hours: 3-6 PM (building peak)
    else if (hour >= 15 && hour <= 17) {
      band = 'ORANGE';
      credit = 0;
      points = 0;
      price = 35;
    }
    
    bands.push({
      hour,
      band,
      price,
      credit,
      points,
      description: getBandDescription(band, price)
    });
  }
  
  return bands;
}