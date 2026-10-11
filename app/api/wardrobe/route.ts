import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { storage } from '@/lib/storage';
import {
  createWardrobeItemSchema,
  WARDROBE_CATEGORIES,
  type WardrobeCategory,
} from '@/lib/validations/wardrobe.schema';
import { Prisma } from '@prisma/client';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_FILE_SIZE = 10 * 1024; // 10KB

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const search = searchParams.get('search');
    const favoritesOnly = searchParams.get('favoritesOnly') === 'true';

    const where: Prisma.WardrobeItemWhereInput = {
      userId: user.id,
    };

    if (category && (WARDROBE_CATEGORIES as readonly string[]).includes(category.toUpperCase())) {
      where.category = category.toUpperCase() as WardrobeCategory;
    }

    if (color && color.trim().length > 0) {
      where.dominantColor = {
        contains: color.trim(),
        mode: 'insensitive',
      };
    }

    if (favoritesOnly) {
      where.isFavorite = true;
    }

    if (search && search.trim().length > 0) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { material: { contains: q, mode: 'insensitive' } },
        { dominantColor: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
        { style: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.wardrobeItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[Wardrobe GET API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve wardrobe items' },
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

    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Image photo is required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(photo.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type "${photo.type}". Allowed types: JPEG, PNG, WebP`,
        },
        { status: 400 }
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image exceeds maximum limit of 10MB' },
        { status: 413 }
      );
    }

    if (photo.size < MIN_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image file too small or corrupted (minimum 10KB required)' },
        { status: 400 }
      );
    }

    const rawData = {
      name: formData.get('name')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      subCategory: formData.get('subCategory')?.toString() || undefined,
      dominantColor: formData.get('dominantColor')?.toString() || '',
      colorHex: formData.get('colorHex')?.toString() || undefined,
      pattern: formData.get('pattern')?.toString() || undefined,
      material: formData.get('material')?.toString() || undefined,
      style: formData.get('style')?.toString() || undefined,
      formality: formData.get('formality')?.toString() || 'CASUAL',
      season: formData.get('season')?.toString() || 'ALL_SEASON',
      fit: formData.get('fit')?.toString() || undefined,
      isFavorite: formData.get('isFavorite') === 'true',
      notes: formData.get('notes')?.toString() || undefined,
    };

    const parsed = createWardrobeItemSchema.safeParse(rawData);
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

    const buffer = Buffer.from(await photo.arrayBuffer());
    const { publicUrl, key } = await storage.uploadFile(buffer, photo.name, photo.type);

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        category: parsed.data.category,
        subCategory: parsed.data.subCategory,
        dominantColor: parsed.data.dominantColor,
        colorHex: parsed.data.colorHex,
        pattern: parsed.data.pattern,
        material: parsed.data.material,
        style: parsed.data.style,
        formality: parsed.data.formality,
        season: parsed.data.season,
        fit: parsed.data.fit,
        isFavorite: parsed.data.isFavorite ?? false,
        notes: parsed.data.notes,
        imageUrl: publicUrl,
        imageKey: key,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('[Wardrobe POST API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create wardrobe item' },
      { status: 500 }
    );
  }
}
