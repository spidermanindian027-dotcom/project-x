import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { LookSource } from '@prisma/client';

const createLookSchema = z.object({
  name: z.string().trim().min(1, 'Look name is required').max(100),
  notes: z.string().trim().max(500).optional().nullable(),
  wardrobeItemIds: z.array(z.string()).min(1, 'At least one wardrobe item is required'),
  source: z.nativeEnum(LookSource).optional().default(LookSource.MANUAL_CURATION),
  overallScore: z.number().min(0).max(100).optional().nullable(),
  analysisId: z.string().optional().nullable(),
  isFavorite: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const isFavorite = searchParams.get('isFavorite') === 'true';

    const where: { userId: string; isFavorite?: boolean } = {
      userId: user.id,
    };
    if (isFavorite) {
      where.isFavorite = true;
    }

    const looks = await prisma.look.findMany({
      where,
      include: {
        items: {
          include: {
            wardrobeItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, looks });
  } catch (error) {
    console.error('[Looks GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve looks' },
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
    const parsed = createLookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, notes, wardrobeItemIds, source, overallScore, analysisId, isFavorite } = parsed.data;

    // Verify EVERY wardrobe item ID belongs to the current user
    const ownedItems = await prisma.wardrobeItem.findMany({
      where: {
        id: { in: wardrobeItemIds },
        userId: user.id,
      },
      select: { id: true },
    });

    if (ownedItems.length !== wardrobeItemIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more wardrobe items do not belong to your account' },
        { status: 403 }
      );
    }

    const look = await prisma.look.create({
      data: {
        userId: user.id,
        name,
        notes: notes || null,
        source,
        overallScore: overallScore ?? null,
        analysisId: analysisId ?? null,
        isFavorite,
        items: {
          create: wardrobeItemIds.map((itemId) => ({
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

    return NextResponse.json({ success: true, look }, { status: 201 });
  } catch (error) {
    console.error('[Looks POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create look' },
      { status: 500 }
    );
  }
}
