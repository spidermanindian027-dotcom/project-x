import { DevelopmentMockTryOnAdapter } from './mock-try-on.adapter';
import type { VirtualTryOnProvider } from './try-on.interface';

function createTryOnProvider(): VirtualTryOnProvider {
  if (process.env.REPLICATE_API_TOKEN) {
    console.log('[TryOn] Replicate API token detected. Production VTON adapter planned for Phase 11.');
  }
  return new DevelopmentMockTryOnAdapter();
}

export const tryOnProvider: VirtualTryOnProvider = createTryOnProvider();
