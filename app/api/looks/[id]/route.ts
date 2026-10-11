import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateLookSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  notes: z.string().trim().max(500).optional().nullable(),
  isFavorite: z.boolean().optional(),
});

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const look = await prisma.look.findFirst({
      where: {
        id,
        userId: user.id, // Strictly scoped
      },
      include: {
        items: {
          include: {
            wardrobeItem: true,
          },
        },
      },
    });

    if (!look) {
      return NextResponse.json({ success: false, error: 'Look not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, look });
  } catch (error) {
    console.error('[Look GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.look.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Look not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const parsed = updateLookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.look.update({
      where: { id: existing.id },
      data: parsed.data,
      include: {
        items: {
          include: {
            wardrobeItem: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, look: updated });
  } catch (error) {
    console.error('[Look PATCH Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update look' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.look.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Look not found' }, { status: 404 });
    }

    await prisma.look.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: 'Look deleted successfully' });
  } catch (error) {
    console.error('[Look DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete look' },
      { status: 500 }
    );
  }
}
