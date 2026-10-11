import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { wardrobeMatcher } from '@/lib/ai/matching.service';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { occasion, season, weatherNote, autoSave } = body;

    // Fetch user's inventory and profile
    const [items, profile] = await Promise.all([
      prisma.wardrobeItem.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.styleProfile.findUnique({
        where: { userId: user.id },
      }),
    ]);

    if (!items || items.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error:
            'You need at least 2 wardrobe items (such as a top and bottom) to create coherent outfit matches.',
        },
        { status: 400 }
      );
    }

    // Run matching engine
    const match = wardrobeMatcher.matchOutfit(items, profile, {
      occasion,
      season,
      weatherNote,
    });

    // CRITICAL: Verify all selected item IDs strictly belong to user
    const userItemIds = new Set(items.map((i) => i.id));
    const allValid = match.selectedItemIds.every((id) => userItemIds.has(id));
    if (!allValid) {
      return NextResponse.json(
        { success: false, error: 'Security violation: Foreign wardrobe item detected' },
        { status: 500 }
      );
    }

    const selectedItems = items.filter((i) => match.selectedItemIds.includes(i.id));

    // Optional autoSave to database
    let savedOutfitRecord = null;
    if (autoSave) {
      savedOutfitRecord = await prisma.savedOutfit.create({
        data: {
          userId: user.id,
          title: match.title,
          occasion: occasion || profile?.occasionWeekday || 'Casual',
          colorRationale: match.colorRationale,
          proportionRationale: match.proportionRationale,
          occasionSuitability: match.occasionSuitability,
          explanation: match.explanation,
          alternatives: match.alternatives,
          items: {
            create: match.selectedItemIds.map((itemId) => ({
              wardrobeItemId: itemId,
            })),
          },
        },
        include: {
          items: {
            include: { wardrobeItem: true },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      match: {
        ...match,
        savedOutfitId: savedOutfitRecord?.id ?? null,
        selectedItems,
      },
    });
  } catch (error) {
    console.error('[Stylist Match API Error]:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Failed to generate outfit match' },
      { status: 500 }
    );
  }
}
