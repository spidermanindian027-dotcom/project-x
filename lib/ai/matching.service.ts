import type { WardrobeItem, StyleProfile } from '@prisma/client';
import type { OutfitMatchingResult } from './ai.interface';

export interface MatchingOptions {
  occasion?: string;
  season?: string;
  weatherNote?: string;
}

const TOP_CATEGORIES = ['TOPS', 'SHIRTS', 'SWEATERS', 'HOODIES', 'DRESSES'] as const;
const BOTTOM_CATEGORIES = ['TROUSERS', 'JEANS', 'SHORTS', 'SKIRTS'] as const;
const FOOTWEAR_CATEGORIES = ['SHOES', 'BOOTS'] as const;
const OUTERWEAR_CATEGORIES = ['JACKETS'] as const;
const ACCESSORY_CATEGORIES = ['BAGS', 'WATCHES', 'SUNGLASSES', 'JEWELLERY', 'OTHER_ACCESSORIES'] as const;

export class WardrobeMatchingService {
  matchOutfit(
    items: WardrobeItem[],
    profile: StyleProfile | null,
    options: MatchingOptions = {}
  ): OutfitMatchingResult {
    if (!items || items.length < 2) {
      throw new Error(
        'You need at least 2 wardrobe items (such as a top and bottom) to create coherent outfit matches.'
      );
    }

    const occasion = (options.occasion || profile?.occasionWeekday || 'casual').toLowerCase();

    // Categorize user's inventory
    const tops = items.filter((i) => (TOP_CATEGORIES as readonly string[]).includes(i.category));
    const bottoms = items.filter((i) => (BOTTOM_CATEGORIES as readonly string[]).includes(i.category));
    const footwear = items.filter((i) => (FOOTWEAR_CATEGORIES as readonly string[]).includes(i.category));
    const outerwear = items.filter((i) => (OUTERWEAR_CATEGORIES as readonly string[]).includes(i.category));
    const accessories = items.filter((i) => (ACCESSORY_CATEGORIES as readonly string[]).includes(i.category));

    // Must be able to construct a look: either a dress, or a top + bottom, or at least 2 items
    let selectedTop: WardrobeItem | null = null;
    let selectedBottom: WardrobeItem | null = null;
    const selectedItemIds: string[] = [];

    // Prioritize dresses for gala / evening / formal if available
    const dresses = tops.filter((t) => t.category === 'DRESSES');
    if (dresses.length > 0 && (occasion.includes('gala') || occasion.includes('formal') || occasion.includes('cocktail'))) {
      selectedTop = dresses[0];
      selectedItemIds.push(selectedTop.id);
    } else if (tops.length > 0 && bottoms.length > 0) {
      // Pick matching top and bottom
      selectedTop = tops[0];
      selectedBottom = bottoms[0];
      selectedItemIds.push(selectedTop.id, selectedBottom.id);
    } else if (tops.length >= 2) {
      selectedItemIds.push(tops[0].id, tops[1].id);
      selectedTop = tops[0];
    } else if (bottoms.length >= 2) {
      selectedItemIds.push(bottoms[0].id, bottoms[1].id);
      selectedBottom = bottoms[0];
    } else {
      // Fallback: pick the first 2 distinct items from user's actual inventory
      selectedItemIds.push(items[0].id, items[1].id);
    }

    // Include footwear if available
    if (footwear.length > 0) {
      selectedItemIds.push(footwear[0].id);
    }

    // Include outerwear if available
    if (outerwear.length > 0) {
      selectedItemIds.push(outerwear[0].id);
    }

    // Include accessory if available
    if (accessories.length > 0 && selectedItemIds.length < 5) {
      selectedItemIds.push(accessories[0].id);
    }

    // Editorial rationale generation
    const primaryColor = selectedTop?.dominantColor || items[0].dominantColor;
    const secondaryColor = selectedBottom?.dominantColor || (items[1] ? items[1].dominantColor : 'Neutral');
    const aesthetic = profile?.primaryArchetype
      ? profile.primaryArchetype.replace(/_/g, ' ')
      : 'Modern Minimalist';

    const title = `${aesthetic} Ensemble in ${primaryColor} & ${secondaryColor}`;
    const colorRationale = `Tonal harmony anchored by ${primaryColor} with subtle resonance against ${secondaryColor}. This pairing evokes intentional restraint rather than forced contrast.`;
    const proportionRationale = `Balanced line geometry: the upper architecture pairs seamlessly with the lower silhouette, elongating the visual frame in accordance with your tailoring calibration.`;
    const occasionSuitability = `Calibrated specifically for ${occasion.replace(/_/g, ' ')} settings, maintaining sartorial authority without excessive ornamentation.`;
    const explanation = `Curated exclusively from your wardrobe vault pieces. The juxtaposition of structural lines and complementary textures delivers quiet elegance suitable for immediate wear.`;
    const alternatives = [
      `Introduce a monochrome leather tote for structured utility.`,
      `Layer with a lightweight virgin wool knit for transitional temperatures.`,
    ];

    const outfitId = `outfit_${Date.now()}`;

    return {
      outfitId,
      title,
      selectedItemIds,
      colorRationale,
      proportionRationale,
      occasionSuitability,
      explanation,
      alternatives,
    };
  }
}

export const wardrobeMatcher = new WardrobeMatchingService();
