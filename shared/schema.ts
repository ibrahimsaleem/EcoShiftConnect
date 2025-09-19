import { z } from "zod";

// EcoShift Data Models

// Appliance model
export const applianceSchema = z.object({
  id: z.string(),
  name: z.string(),
  powerMin: z.number().min(0),
  powerMax: z.number().min(0),
  defaultRuntime: z.number().min(0.5).max(24),
  selected: z.boolean().default(false),
  runtime: z.number().min(0.5).max(24).optional(),
  startTime: z.number().min(0).max(23).optional(),
  flexHours: z.number().min(1).max(12).optional(),
});

// Eco band model
export const ecoBandSchema = z.object({
  hour: z.number().min(0).max(23),
  band: z.enum(['GREEN', 'BLUE', 'ORANGE', 'RED']),
  price: z.number().min(0),
  credit: z.number(),
  points: z.number(),
  description: z.string(),
});

// TypeScript interfaces will be exported at the bottom

// Optimization request
export const optimizationRequestSchema = z.object({
  appliances: z.array(applianceSchema),
  preferences: z.object({
    prioritizeSavings: z.boolean().default(true),
    prioritizeEcoPoints: z.boolean().default(false),
    avoidPeakHours: z.boolean().default(true),
  }).optional(),
});

// Optimization result
export const optimizationResultSchema = z.object({
  appliance: z.string(),
  originalTime: z.number().min(0).max(23),
  recommendedTime: z.number().min(0).max(23),
  savings: z.number(),
  ecoPoints: z.number(),
  reasoning: z.string(),
  energyUsed: z.number(),
});

export const optimizationSummarySchema = z.object({
  totalSavings: z.number(),
  totalEcoPoints: z.number(),
  totalEnergyShifted: z.number(),
  carbonReduction: z.number(),
  schedules: z.array(optimizationResultSchema),
});

// AI recommendation request (legacy)
export const aiRecommendationRequestSchema = z.object({
  optimizationSummary: optimizationSummarySchema,
  userContext: z.string().optional(),
});

// Enhanced AI recommendation request
export const enhancedAIRecommendationRequestSchema = z.object({
  appliances: z.array(applianceSchema),
  ecoBands: z.array(ecoBandSchema),
  userContext: z.string().optional(),
});

// Export types
export type Appliance = z.infer<typeof applianceSchema>;
export type EcoBand = z.infer<typeof ecoBandSchema>;
export type OptimizationRequest = z.infer<typeof optimizationRequestSchema>;
export type OptimizationResult = z.infer<typeof optimizationResultSchema>;
export type OptimizationSummary = z.infer<typeof optimizationSummarySchema>;
export type AIRecommendationRequest = z.infer<typeof aiRecommendationRequestSchema>;
export type EnhancedAIRecommendationRequest = z.infer<typeof enhancedAIRecommendationRequestSchema>;