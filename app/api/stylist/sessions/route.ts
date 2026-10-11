import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.stylistSession.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('[Stylist Sessions GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve styling consultations' },
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

    const body = await request.json().catch(() => ({}));
    const title = body.title?.toString().trim() || 'Styling Consultation';

    const session = await prisma.stylistSession.create({
      data: {
        userId: user.id,
        title,
      },
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error) {
    console.error('[Stylist Sessions POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create styling consultation session' },
      { status: 500 }
    );
  }
}
