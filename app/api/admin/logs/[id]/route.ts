import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const updateLogSchema = z.object({
  resolved: z.boolean(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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
        event: 'FORBIDDEN_AUDIT_LOG_UPDATE',
        route: '/api/admin/logs/[id]',
        method: 'PATCH',
        userId: actor.id,
      });
      return NextResponse.json(
        { success: false, error: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateLogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload. "resolved" boolean is required.' },
        { status: 400 }
      );
    }

    const existingLog = await prisma.securityAuditLog.findUnique({
      where: { id },
    });

    if (!existingLog) {
      return NextResponse.json(
        { success: false, error: 'Audit log entry not found.' },
        { status: 404 }
      );
    }

    const updated = await prisma.securityAuditLog.update({
      where: { id },
      data: {
        resolved: parsed.data.resolved,
      },
    });

    await logger.logInfo({
      requestId,
      event: 'AUDIT_LOG_RESOLVED_UPDATE',
      route: `/api/admin/logs/${id}`,
      method: 'PATCH',
      userId: actor.id,
      details: { logId: id, resolved: parsed.data.resolved },
    });

    return NextResponse.json({
      success: true,
      log: updated,
    });
  } catch (error) {
    console.error('Update audit log API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update audit log entry.' },
      { status: 500 }
    );
  }
}
