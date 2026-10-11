import { LocalStorageAdapter } from './local-storage.adapter';
import type { StorageProvider } from './storage.interface';

function createStorageProvider(): StorageProvider {
  const { S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;
  if (S3_BUCKET && S3_REGION && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY) {
    console.log('[Storage] S3 credentials detected. S3StorageAdapter planned for Phase 5 — using local fallback.');
  }
  return new LocalStorageAdapter();
}

export const storage: StorageProvider = createStorageProvider();
