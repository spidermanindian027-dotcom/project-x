import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { storage } from '@/lib/storage';
import { outfitAI } from '@/lib/ai';
import { rateLimit } from '@/lib/rate-limit';
import { OutfitAnalysisResultSchema } from '@/lib/ai/ai.interface';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MIN_IMAGE_SIZE_BYTES } from '@/lib/validations/outfit.schema';

export async function POST(request: NextRequest) {
  let uploadedKey: string | null = null;
  const requestId = `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  try {
    // 1. Auth
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: { 'X-Request-ID': requestId } });
    }

    // 2. Rate limiting (10 per 60 minutes)
    const rl = rateLimit(`outfit_scan:${user.id}`, 10, 60 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'X-Request-ID': requestId, 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': rl.resetAt.toISOString() } }
      );
    }

    // 3. Parse form data
    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;
    if (!photo) {
      return NextResponse.json({ success: false, error: 'No photo provided. Upload a photo of your outfit.' }, { status: 400, headers: { 'X-Request-ID': requestId } });
    }

    // 4. Validate image
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(photo.type)) {
      return NextResponse.json({ success: false, error: `Invalid file type "${photo.type}". Accepted: JPEG, PNG, WebP.` }, { status: 400, headers: { 'X-Request-ID': requestId } });
    }
    if (photo.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ success: false, error: 'Image exceeds 10MB limit. Please use a smaller file.' }, { status: 413, headers: { 'X-Request-ID': requestId } });
    }
    if (photo.size < MIN_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ success: false, error: 'Image appears to be blank or corrupted (too small).' }, { status: 400, headers: { 'X-Request-ID': requestId } });
    }

    // 5. Upload image
    const buffer = Buffer.from(await photo.arrayBuffer());
    const { publicUrl, key } = await storage.uploadFile(buffer, photo.name, photo.type);
    uploadedKey = key;

    // 6. AI analysis with 15-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    let rawResult;
    try {
      rawResult = await Promise.race([
        outfitAI.analyzeOutfit(publicUrl),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => reject(new Error('ANALYSIS_TIMEOUT')));
        }),
      ]);
    } catch (err) {
      clearTimeout(timeoutId);
      if ((err as Error).message === 'ANALYSIS_TIMEOUT') {
        await storage.deleteFile(key).catch(() => {});
        uploadedKey = null;
        return NextResponse.json({ success: false, error: 'Analysis timed out. Please retry.' }, { status: 504, headers: { 'X-Request-ID': requestId } });
      }
      throw err;
    }
    clearTimeout(timeoutId);

    // 7. Validate AI response with Zod
    const parsed = OutfitAnalysisResultSchema.safeParse(rawResult);
    if (!parsed.success) {
      await storage.deleteFile(key).catch(() => {});
      uploadedKey = null;
      return NextResponse.json(
        { success: false, error: 'AI returned an invalid response. Please retry.' },
        { status: 502, headers: { 'X-Request-ID': requestId } }
      );
    }

    // 8. RECOMPUTE overallScore using weighted formula (never trust AI score directly)
    const { colourHarmonyScore, fitProportionScore, coordinationScore, occasionScore, accessoriesScore, styleCoherenceScore } = parsed.data;
    const overallScore = Math.round(
      (colourHarmonyScore * 0.20 + fitProportionScore * 0.25 + coordinationScore * 0.20 +
       occasionScore * 0.15 + accessoriesScore * 0.10 + styleCoherenceScore * 0.10) * 10
    ) / 10;

    // 9. Persist to database
    const analysis = await prisma.outfitAnalysis.create({
      data: {
        userId: user.id,
        requestId,
        imageUrl: publicUrl,
        imageKey: key,
        overallScore,
        confidence: parsed.data.confidence,
        colourHarmonyScore: parsed.data.colourHarmonyScore,
        fitProportionScore: parsed.data.fitProportionScore,
        coordinationScore: parsed.data.coordinationScore,
        occasionScore: parsed.data.occasionScore,
        accessoriesScore: parsed.data.accessoriesScore,
        styleCoherenceScore: parsed.data.styleCoherenceScore,
        styleLabel: parsed.data.styleLabel,
        whatWorks: parsed.data.whatWorks,
        areasToImprove: parsed.data.areasToImprove,
        recommendedColours: parsed.data.recommendedColours,
        recommendedFootwear: parsed.data.recommendedFootwear,
        recommendedAccessories: parsed.data.recommendedAccessories,
        styleTags: parsed.data.styleTags,
        occasionObservations: parsed.data.occasionObservations,
        providerUsed: outfitAI.providerName,
      },
    });

    // 10. Return structured response
    return NextResponse.json(
      {
        success: true,
        requestId,
        analysis: { ...analysis, createdAt: analysis.createdAt.toISOString() },
        isProductionAnalysis: outfitAI.isProductionProvider,
      },
      {
        status: 200,
        headers: {
          'X-Request-ID': requestId,
          'X-Provider-Used': outfitAI.providerName,
          'X-RateLimit-Remaining': String(rl.remaining),
        },
      }
    );
  } catch (error) {
    console.error('[Outfit Analysis] Unhandled error:', error);
    if (uploadedKey) {
      await storage.deleteFile(uploadedKey).catch(() => {});
    }
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please retry.' },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    );
  }
}
