export interface StorageResult {
  publicUrl: string;
  key: string;
}

export interface StorageProvider {
  readonly providerName: string;
  uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<StorageResult>;
  deleteFile(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
