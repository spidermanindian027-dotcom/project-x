import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { StorageProvider, StorageResult } from './storage.interface';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export class LocalStorageAdapter implements StorageProvider {
  readonly providerName = 'local_filesystem';

  async uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<StorageResult> {
    console.warn('[LocalStorage] Using local file system. Configure S3 for production.');
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = mimeType.split('/')[1] ?? 'bin';
    const key = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, key);
    await fs.writeFile(filepath, buffer);
    return { publicUrl: `/uploads/${key}`, key };
  }

  async deleteFile(key: string): Promise<void> {
    const filepath = path.join(UPLOAD_DIR, key);
    await fs.unlink(filepath).catch(() => {});
  }

  getPublicUrl(key: string): string {
    return `/uploads/${key}`;
  }
}
