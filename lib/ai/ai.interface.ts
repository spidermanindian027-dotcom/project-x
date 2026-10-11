import { z } from 'zod';

export const OutfitAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  colourHarmonyScore: z.number().min(0).max(100),
  fitProportionScore: z.number().min(0).max(100),
  coordinationScore: z.number().min(0).max(100),
  occasionScore: z.number().min(0).max(100),
  accessoriesScore: z.number().min(0).max(100),
  styleCoherenceScore: z.number().min(0).max(100),
  styleLabel: z.string().min(1).max(100),
  whatWorks: z.array(z.string()).min(1).max(8),
  areasToImprove: z.array(z.string()).max(6),
  recommendedColours: z.array(z.string()).max(8),
  recommendedFootwear: z.array(z.string()).max(5),
  recommendedAccessories: z.array(z.string()).max(6),
  styleTags: z.array(z.string()).max(10),
  occasionObservations: z.string().min(1).max(500),
});

export type OutfitAnalysisResult = z.infer<typeof OutfitAnalysisResultSchema>;

export interface OutfitAIProvider {
  readonly providerName: string;
  readonly isProductionProvider: boolean;
  analyzeOutfit(imageUrl: string, userStyleContext?: string): Promise<OutfitAnalysisResult>;
}

export const OutfitMatchingResultSchema = z.object({
  outfitId: z.string(),
  title: z.string().min(1),
  selectedItemIds: z.array(z.string()).min(1),
  colorRationale: z.string().min(1),
  proportionRationale: z.string().min(1),
  occasionSuitability: z.string().min(1),
  explanation: z.string().min(1),
  alternatives: z.array(z.string()).default([]),
});

export type OutfitMatchingResult = z.infer<typeof OutfitMatchingResultSchema>;

