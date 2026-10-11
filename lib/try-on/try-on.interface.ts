export interface TryOnSubmitParams {
  userId: string;
  referenceImageUrl: string;
  selectedItemIds: string[];
  garmentImageUrls: string[];
}

export interface TryOnJobResult {
  jobId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  resultImageUrl?: string;
  errorMessage?: string;
  durationMs?: number;
  isDevelopmentAdapter: boolean;
}

export interface VirtualTryOnProvider {
  readonly providerName: string;
  readonly isProductionProvider: boolean;
  submitJob(params: TryOnSubmitParams): Promise<{ jobId: string }>;
  checkStatus(jobId: string): Promise<TryOnJobResult>;
}
