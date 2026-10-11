import type { OutfitAIProvider, OutfitAnalysisResult } from './ai.interface';

function deterministicHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

const STYLE_LABELS = [
  'Modern Minimalist Tailoring',
  'Contemporary Monochromatic Architecture',
  'Refined Quiet Luxury Ensemble',
  'Avant-Garde Layered Drapery',
  'Elevated Classic Sartorialism',
  'Subversive Streetwear Synthesis',
];

const OBSERVATIONS = [
  'The outfit demonstrates strong silhouette discipline and thoughtful proportion balance, with well-considered vertical alignment.',
  'A cohesive interplay of textiles and silhouettes. The drape creates clean visual lines suitable for gallery and evening settings.',
  'Crisp monochromatic elements deliver high-impact simplicity, though micro-adjustments to hem length could elevate line flow.',
  'Confident contemporary presence with refined textural balance across layers, commanding executive presence.',
];

export class DevelopmentMockAIProvider implements OutfitAIProvider {
  readonly providerName = 'development_mock';
  readonly isProductionProvider = false;

  async analyzeOutfit(imageUrl: string, _userStyleContext?: string): Promise<OutfitAnalysisResult> {
    void _userStyleContext;
    console.warn(
      '[DevelopmentMockAIProvider] Warning: Using development mock AI provider. Results are deterministic and simulated.'
    );

    const hash = deterministicHash(imageUrl);

    // Deterministic base scores between 65 and 95
    const colourHarmonyScore = 65 + (hash % 30);
    const fitProportionScore = 68 + ((hash >> 2) % 28);
    const coordinationScore = 66 + ((hash >> 4) % 29);
    const occasionScore = 70 + ((hash >> 6) % 25);
    const accessoriesScore = 62 + ((hash >> 8) % 32);
    const styleCoherenceScore = 67 + ((hash >> 10) % 28);

    // Weighted formula: colour*0.20 + fit*0.25 + coord*0.20 + occasion*0.15 + accessories*0.10 + coherence*0.10
    const rawOverall =
      colourHarmonyScore * 0.2 +
      fitProportionScore * 0.25 +
      coordinationScore * 0.2 +
      occasionScore * 0.15 +
      accessoriesScore * 0.1 +
      styleCoherenceScore * 0.1;

    const overallScore = Math.round(rawOverall * 10) / 10;
    const confidence = 0.85 + ((hash % 10) / 100);

    const styleLabel = STYLE_LABELS[hash % STYLE_LABELS.length];
    const occasionObservations = OBSERVATIONS[hash % OBSERVATIONS.length];

    return {
      overallScore,
      confidence,
      colourHarmonyScore,
      fitProportionScore,
      coordinationScore,
      occasionScore,
      accessoriesScore,
      styleCoherenceScore,
      styleLabel,
      whatWorks: [
        'Proportional harmony between upper and lower silhouettes',
        'Balanced chromatic contrast with intentional focal points',
        'Complementary fabric drape and structural shoulder line',
      ],
      areasToImprove: [
        'Consider introducing a tonal layering piece for textural depth',
        'Subtle footwear adjustment to extend lower visual lines',
      ],
      recommendedColours: ['Warm Ivory', 'Charcoal Slate', 'Burnished Gold', 'Midnight Navy'],
      recommendedFootwear: ['Minimalist Leather Chelsea Boots', 'Matte Oxford Loafers'],
      recommendedAccessories: ['Brushed Metal Chronograph', 'Structured Leather Portfolio'],
      styleTags: ['Tailored', 'Minimalist', 'Monochrome', 'Contemporary'],
      occasionObservations,
    };
  }
}
