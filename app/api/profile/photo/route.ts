import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { storage } from '@/lib/storage';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;
const MIN_BYTES = 10 * 1024;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;
    if (!photo) return NextResponse.json({ success: false, error: 'No photo provided' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json({ success: false, error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });
    }
    if (photo.size > MAX_BYTES) return NextResponse.json({ success: false, error: 'File exceeds 8MB limit' }, { status: 413 });
    if (photo.size < MIN_BYTES) return NextResponse.json({ success: false, error: 'Image appears blank or too small' }, { status: 400 });

    const buffer = Buffer.from(await photo.arrayBuffer());
    const existingProfile = await prisma.styleProfile.findUnique({ where: { userId: user.id } });
    
    const { publicUrl, key } = await storage.uploadFile(buffer, photo.name, photo.type);
    
    // Delete old photo if present
    if (existingProfile?.referencePhotoKey) {
      await storage.deleteFile(existingProfile.referencePhotoKey).catch(() => {});
    }

    await prisma.styleProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, referencePhotoUrl: publicUrl, referencePhotoKey: key },
      update: { referencePhotoUrl: publicUrl, referencePhotoKey: key },
    });
    
    return NextResponse.json({ success: true, photoUrl: publicUrl });
  } catch {
    return NextResponse.json({ success: false, error: 'Upload failed. Please retry.' }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const profile = await prisma.styleProfile.findUnique({ where: { userId: user.id } });
  if (profile?.referencePhotoKey) {
    await storage.deleteFile(profile.referencePhotoKey).catch(() => {});
  }
  await prisma.styleProfile.update({
    where: { userId: user.id },
    data: { referencePhotoUrl: null, referencePhotoKey: null },
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
