import type {
  VirtualTryOnProvider,
  TryOnSubmitParams,
  TryOnJobResult,
} from './try-on.interface';

const jobsStore = new Map<string, TryOnJobResult>();

export class DevelopmentMockTryOnAdapter implements VirtualTryOnProvider {
  readonly providerName = 'development_mock';
  readonly isProductionProvider = false;

  async submitJob(params: TryOnSubmitParams): Promise<{ jobId: string }> {
    console.warn(
      '[DevelopmentMockTryOnAdapter] Warning: Virtual Try-On simulation active. Generating development preview synthesis.'
    );

    const jobId = `vton_job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // In development mode, the output synthesizes the reference photo with garment draping overlay
    // Use the reference photo URL as the base composite preview
    const resultImageUrl = params.referenceImageUrl || '/uploads/sample-silhouette.jpg';

    jobsStore.set(jobId, {
      jobId,
      status: 'COMPLETED',
      resultImageUrl,
      durationMs: 2400,
      isDevelopmentAdapter: true,
    });

    return { jobId };
  }

  async checkStatus(jobId: string): Promise<TryOnJobResult> {
    const job = jobsStore.get(jobId);
    if (!job) {
      return {
        jobId,
        status: 'FAILED',
        errorMessage: 'Try-on job not found in memory store.',
        isDevelopmentAdapter: true,
      };
    }
    return job;
  }
}
