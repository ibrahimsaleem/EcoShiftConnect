import type { OptimizationSummary } from "@shared/schema";

// Simple in-memory storage for EcoShift optimization results
export interface IStorage {
  storeOptimizationResult(id: string, result: OptimizationSummary): Promise<void>;
  getOptimizationResult(id: string): Promise<OptimizationSummary | undefined>;
}

export class MemStorage implements IStorage {
  private optimizationResults: Map<string, OptimizationSummary>;

  constructor() {
    this.optimizationResults = new Map();
  }

  async storeOptimizationResult(id: string, result: OptimizationSummary): Promise<void> {
    this.optimizationResults.set(id, result);
  }

  async getOptimizationResult(id: string): Promise<OptimizationSummary | undefined> {
    return this.optimizationResults.get(id);
  }
}

export const storage = new MemStorage();