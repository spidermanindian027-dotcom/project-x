import { z } from 'zod';

export const WARDROBE_CATEGORIES = [
  'TOPS',
  'SHIRTS',
  'TROUSERS',
  'JEANS',
  'SHORTS',
  'DRESSES',
  'SKIRTS',
  'JACKETS',
  'SWEATERS',
  'HOODIES',
  'SHOES',
  'BOOTS',
  'BAGS',
  'WATCHES',
  'SUNGLASSES',
  'JEWELLERY',
  'OTHER_ACCESSORIES',
] as const;

export const FORMALITY_LEVELS = [
  'CASUAL',
  'SMART_CASUAL',
  'BUSINESS',
  'FORMAL',
  'EVENING_GALA',
] as const;

export const SEASON_CATEGORIES = [
  'SPRING',
  'SUMMER',
  'AUTUMN',
  'WINTER',
  'ALL_SEASON',
] as const;

const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const createWardrobeItemSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  category: z.enum(WARDROBE_CATEGORIES),
  subCategory: z.string().trim().max(100).optional().nullable(),
  dominantColor: z.string().trim().min(2, 'Dominant color must be at least 2 characters').max(50),
  colorHex: z
    .string()
    .trim()
    .regex(hexRegex, 'Must be a valid hex color code')
    .optional()
    .nullable(),
  pattern: z.string().trim().max(50).optional().nullable(),
  material: z.string().trim().max(50).optional().nullable(),
  style: z.string().trim().max(50).optional().nullable(),
  formality: z.enum(FORMALITY_LEVELS).default('CASUAL'),
  season: z.enum(SEASON_CATEGORIES).default('ALL_SEASON'),
  fit: z.string().trim().max(50).optional().nullable(),
  isFavorite: z.boolean().default(false).optional(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const updateWardrobeItemSchema = createWardrobeItemSchema.partial();

export type WardrobeCategory = (typeof WARDROBE_CATEGORIES)[number];
export type FormalityLevel = (typeof FORMALITY_LEVELS)[number];
export type SeasonCategory = (typeof SEASON_CATEGORIES)[number];

export type CreateWardrobeItemInput = z.infer<typeof createWardrobeItemSchema>;
export type UpdateWardrobeItemInput = z.infer<typeof updateWardrobeItemSchema>;
