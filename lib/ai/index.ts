import { DevelopmentMockAIProvider } from './mock-ai.adapter';
import type { OutfitAIProvider } from './ai.interface';

function createAIProvider(): OutfitAIProvider {
  if (process.env.OPENAI_API_KEY) {
    console.log('[AI] OpenAI API key detected. OpenAI provider will be implemented in Phase 5.');
    // DO NOT fake results. Throw a clear error if called.
    return {
      providerName: 'openai_stub',
      isProductionProvider: true,
      analyzeOutfit: async () => {
        throw new Error('OpenAI provider not yet implemented. Install openai package in Phase 5.');
      },
    };
  }
  if (process.env.GEMINI_API_KEY) {
    console.log('[AI] Gemini API key detected. Gemini provider will be implemented in Phase 5.');
    return {
      providerName: 'gemini_stub',
      isProductionProvider: true,
      analyzeOutfit: async () => {
        throw new Error('Gemini provider not yet implemented. Install @google/generative-ai in Phase 5.');
      },
    };
  }
  return new DevelopmentMockAIProvider();
}

export const outfitAI: OutfitAIProvider = createAIProvider();
