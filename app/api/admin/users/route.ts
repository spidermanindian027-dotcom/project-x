import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const actor = await getCurrentUser();
    if (!actor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    if (actor.role !== Role.ADMIN) {
      await logger.logSecurity({
        requestId,
        event: 'FORBIDDEN_USER_ROSTER_READ',
        route: '/api/admin/users',
        method: 'GET',
        userId: actor.id,
      });
      return NextResponse.json(
        { success: false, error: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Math.min(Math.max(limitParam, 1), 100);

    const whereClause: {
      OR?: [
        { email: { contains: string; mode: 'insensitive' } },
        { fullName: { contains: string; mode: 'insensitive' } },
      ];
    } = {};

    if (search.trim()) {
      whereClause.OR = [
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { fullName: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // Retrieve users with item and analysis counts, strictly omitting passwordHash
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            wardrobeItems: true,
            outfitAnalyses: true,
            looks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      createdAt: u.createdAt,
      wardrobeCount: u._count.wardrobeItems,
      analysesCount: u._count.outfitAnalyses,
      looksCount: u._count.looks,
    }));

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve client roster.' },
      { status: 500 }
    );
  }
}
