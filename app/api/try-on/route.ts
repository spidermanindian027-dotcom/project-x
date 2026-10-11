import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { tryOnProvider } from '@/lib/try-on';
import { TryOnStatus } from '@prisma/client';

const submitTryOnSchema = z.object({
  referenceImageUrl: z.string().url().optional(),
  selectedItemIds: z.array(z.string()).min(1, 'Please select at least 1 garment to try on'),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await prisma.tryOnJob.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('[TryOn GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve try-on history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = submitTryOnSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { selectedItemIds } = parsed.data;

    // Verify all selected garments belong to current user
    const userItems = await prisma.wardrobeItem.findMany({
      where: {
        id: { in: selectedItemIds },
        userId: user.id,
      },
    });

    if (userItems.length !== selectedItemIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more garments do not belong to your wardrobe' },
        { status: 403 }
      );
    }

    // Determine reference photo
    let referenceUrl = parsed.data.referenceImageUrl;
    if (!referenceUrl) {
      const profile = await prisma.styleProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile?.referencePhotoUrl) {
        return NextResponse.json(
          {
            success: false,
            error: 'No reference photo found. Please upload or take a reference photo to begin virtual try-on.',
          },
          { status: 400 }
        );
      }
      referenceUrl = profile.referencePhotoUrl;
    }

    // Create Initial TryOnJob record
    const jobRecord = await prisma.tryOnJob.create({
      data: {
        userId: user.id,
        referenceImageUrl: referenceUrl,
        selectedItemIds,
        provider: tryOnProvider.providerName,
        modelIdentifier: 'vestra-vton-dev-v1',
        status: TryOnStatus.PROCESSING,
      },
    });

    // Run provider job
    const { jobId } = await tryOnProvider.submitJob({
      userId: user.id,
      referenceImageUrl: referenceUrl,
      selectedItemIds,
      garmentImageUrls: userItems.map((i) => i.imageUrl),
    });

    // Check status / synthesize result
    const result = await tryOnProvider.checkStatus(jobId);

    // Update job in database
    const completedJob = await prisma.tryOnJob.update({
      where: { id: jobRecord.id },
      data: {
        status: result.status === 'COMPLETED' ? TryOnStatus.COMPLETED : TryOnStatus.FAILED,
        resultImageUrl: result.resultImageUrl || referenceUrl,
        errorMessage: result.errorMessage || null,
        durationMs: result.durationMs || 2400,
      },
    });

    return NextResponse.json({
      success: true,
      jobId: completedJob.id,
      job: completedJob,
    }, { status: 201 });
  } catch (error) {
    console.error('[TryOn POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process virtual try-on job' },
      { status: 500 }
    );
  }
}
