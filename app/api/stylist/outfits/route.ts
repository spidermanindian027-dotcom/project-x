import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const outfits = await prisma.savedOutfit.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            wardrobeItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, outfits });
  } catch (error) {
    console.error('[Saved Outfits GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve saved outfits' },
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
    if (!body || !Array.isArray(body.itemIds) || body.itemIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Outfit requires a title and at least one item ID' },
        { status: 400 }
      );
    }

    const {
      title,
      occasion,
      colorRationale,
      proportionRationale,
      occasionSuitability,
      explanation,
      alternatives,
      itemIds,
    } = body;

    // Verify all item IDs belong to the current user
    const userItems = await prisma.wardrobeItem.findMany({
      where: {
        id: { in: itemIds },
        userId: user.id,
      },
      select: { id: true },
    });

    if (userItems.length !== itemIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more items do not belong to your wardrobe' },
        { status: 403 }
      );
    }

    const outfit = await prisma.savedOutfit.create({
      data: {
        userId: user.id,
        title: title || 'Curated Atelier Look',
        occasion: occasion || 'Casual',
        colorRationale: colorRationale || 'Balanced color harmony',
        proportionRationale: proportionRationale || 'Tailored proportions',
        occasionSuitability: occasionSuitability || 'Appropriate for setting',
        explanation: explanation || 'Curated from wardrobe vault.',
        alternatives: Array.isArray(alternatives) ? alternatives : [],
        items: {
          create: itemIds.map((itemId: string) => ({
            wardrobeItemId: itemId,
          })),
        },
      },
      include: {
        items: {
          include: {
            wardrobeItem: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, outfit }, { status: 201 });
  } catch (error) {
    console.error('[Saved Outfits POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save outfit' },
      { status: 500 }
    );
  }
}
