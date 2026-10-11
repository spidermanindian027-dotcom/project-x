import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { stylistChatService } from '@/lib/ai/chat.service';

const chatMessageInputSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  content: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message exceeds 1000 character limit'),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
    }

    // Verify ownership of the session
    const session = await prisma.stylistSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id, // Strictly scoped
      },
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Consultation session not found' }, { status: 404 });
    }

    const messages = await prisma.stylistMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('[Stylist Chat GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve consultation messages' },
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
    const parsed = chatMessageInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sessionId, content } = parsed.data;

    // Verify ownership
    const session = await prisma.stylistSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id, // Strictly scoped
      },
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Consultation session not found' }, { status: 404 });
    }

    // 1. Persist User Message
    await prisma.stylistMessage.create({
      data: {
        sessionId,
        role: 'user',
        content,
      },
    });

    // 2. Fetch User Context: Wardrobe and StyleProfile
    const [items, profile] = await Promise.all([
      prisma.wardrobeItem.findMany({
        where: { userId: user.id },
      }),
      prisma.styleProfile.findUnique({
        where: { userId: user.id },
      }),
    ]);

    // 3. Generate Stylist Response with Context Injection
    const { content: assistantContent, referencedItemIds } =
      stylistChatService.generateResponse({
        userMessage: content,
        items,
        profile,
      });

    // 4. Persist Assistant Message
    const assistantMessage = await prisma.stylistMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: assistantContent,
        referencedItemIds,
      },
    });

    // 5. Update session timestamp
    await prisma.stylistSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: assistantMessage }, { status: 201 });
  } catch (error) {
    console.error('[Stylist Chat POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process styling consultation' },
      { status: 500 }
    );
  }
}
