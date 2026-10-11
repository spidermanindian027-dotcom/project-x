import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { storage } from '@/lib/storage';
import { updateWardrobeItemSchema } from '@/lib/validations/wardrobe.schema';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const item = await prisma.wardrobeItem.findFirst({
      where: {
        id,
        userId: user.id, // Strictly scoped to current user
      },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('[Wardrobe Item GET Error]:', error);
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

    // Check ownership
    const existing = await prisma.wardrobeItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = updateWardrobeItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.wardrobeItem.update({
      where: { id: existing.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('[Wardrobe Item PATCH Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update wardrobe item' },
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

    const existing = await prisma.wardrobeItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    // Clean up stored file
    if (existing.imageKey) {
      await storage.deleteFile(existing.imageKey).catch(() => {});
    }

    // Delete record from database
    await prisma.wardrobeItem.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('[Wardrobe Item DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete wardrobe item' },
      { status: 500 }
    );
  }
}
