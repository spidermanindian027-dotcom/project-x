import { z } from 'zod';

export const BODY_TYPES = [
  'PETITE', 'STRAIGHT', 'ATHLETIC', 'PEAR', 'APPLE',
  'HOURGLASS', 'RECTANGULAR', 'PREFER_NOT_TO_SAY',
] as const;

export const STYLE_ARCHETYPES = [
  'QUIET_LUXURY', 'AVANT_GARDE', 'MINIMAL_TAILORED', 'OLD_MONEY',
  'STREETWEAR_EDGE', 'ROMANTIC_FEMININE', 'CLASSIC_PREPPY',
  'BOHEMIAN', 'POWER_DRESSING', 'ECLECTIC_ARTISAN',
] as const;

export const styleProfileUpdateSchema = z.object({
  primaryArchetype: z.enum(STYLE_ARCHETYPES).optional().nullable(),
  secondaryArchetype: z.enum(STYLE_ARCHETYPES).optional().nullable(),
  styleKeywords: z.array(z.string().trim().max(40)).max(20).optional(),
  bodyProportionType: z.enum(BODY_TYPES).optional(),
  proportionSource: z.enum(['manual', 'camera_estimated']).optional(),
  preferredColours: z.array(z.string().trim().max(50)).max(20).optional(),
  avoidedColours: z.array(z.string().trim().max(50)).max(20).optional(),
  skinToneCategory: z.enum(['warm', 'cool', 'neutral', 'unset']).optional(),
  occasionWeekday: z.enum(['casual', 'smart_casual', 'business', 'formal']).optional(),
  occasionWeekend: z.enum(['casual', 'smart_casual', 'business', 'formal']).optional(),
  occasionFormal: z.boolean().optional(),
  onboardingStep: z.number().int().min(1).max(6).optional(),
  onboardingCompleted: z.boolean().optional(),
});

export type StyleProfileUpdateInput = z.infer<typeof styleProfileUpdateSchema>;
