import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.savedOutfit.findFirst({
      where: {
        id,
        userId: user.id, // Strictly scoped
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Saved outfit not found' }, { status: 404 });
    }

    await prisma.savedOutfit.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: 'Outfit removed from lookbook' });
  } catch (error) {
    console.error('[Saved Outfit DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete saved outfit' },
      { status: 500 }
    );
  }
}
