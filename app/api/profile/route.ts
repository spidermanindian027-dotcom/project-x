import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { styleProfileUpdateSchema } from '@/lib/validations/profile.schema';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  let profile = await prisma.styleProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    profile = await prisma.styleProfile.create({ data: { userId: user.id } });
  }
  return NextResponse.json({ success: true, profile });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const json = await request.json().catch(() => null);
  if (!json) return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });

  const parsed = styleProfileUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const profile = await prisma.styleProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  });
  return NextResponse.json({ success: true, profile });
}
