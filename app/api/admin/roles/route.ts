import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { roleUpdateSchema } from '@/lib/validations/auth.schema';
import { assertCanManageRoles } from '@/lib/auth/admin';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const actor = await getCurrentUser();
    if (!actor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    try {
      assertCanManageRoles(actor);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Only administrators can modify user roles.',
        },
        { status: 403 }
      );
    }

    const json = await request.json().catch(() => null);
    const validation = roleUpdateSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed.',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { userId, role } = validation.data;

    // Check if target user exists
    const target = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Target user not found.' },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Admin role assignment API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user role.' },
      { status: 500 }
    );
  }
}
