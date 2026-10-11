import { z } from 'zod';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MIN_IMAGE_SIZE_BYTES = 15 * 1024;

export const outfitScanResponseSchema = z.object({
  success: z.literal(true),
  requestId: z.string(),
  analysis: z.object({
    id: z.string(),
    overallScore: z.number(),
    confidence: z.number(),
    colourHarmonyScore: z.number(),
    fitProportionScore: z.number(),
    coordinationScore: z.number(),
    occasionScore: z.number(),
    accessoriesScore: z.number(),
    styleCoherenceScore: z.number(),
    styleLabel: z.string(),
    whatWorks: z.array(z.string()),
    areasToImprove: z.array(z.string()),
    recommendedColours: z.array(z.string()),
    recommendedFootwear: z.array(z.string()),
    recommendedAccessories: z.array(z.string()),
    styleTags: z.array(z.string()),
    occasionObservations: z.string(),
    providerUsed: z.string(),
    createdAt: z.string(),
  }),
  isProductionAnalysis: z.boolean(),
});
