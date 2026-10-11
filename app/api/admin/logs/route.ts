import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { Role, LogSeverity } from '@prisma/client';
import { logger, redactSensitiveData } from '@/lib/logger';

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
        event: 'FORBIDDEN_AUDIT_LOG_READ',
        route: '/api/admin/logs',
        method: 'GET',
        userId: actor.id,
      });
      return NextResponse.json(
        { success: false, error: 'Forbidden: Administrator privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const severityParam = searchParams.get('severity');
    const eventParam = searchParams.get('event');
    const resolvedParam = searchParams.get('resolved');
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Math.min(Math.max(limitParam, 1), 100);

    const whereClause: {
      severity?: LogSeverity;
      event?: { contains: string; mode: 'insensitive' };
      resolved?: boolean;
    } = {};

    if (severityParam && Object.values(LogSeverity).includes(severityParam as LogSeverity)) {
      whereClause.severity = severityParam as LogSeverity;
    }
    if (eventParam) {
      whereClause.event = { contains: eventParam, mode: 'insensitive' };
    }
    if (resolvedParam !== null && resolvedParam !== undefined) {
      if (resolvedParam === 'true') whereClause.resolved = true;
      if (resolvedParam === 'false') whereClause.resolved = false;
    }

    const logs = await prisma.securityAuditLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    const sanitizedLogs = logs.map((l) => ({
      ...l,
      details: redactSensitiveData(l.details),
    }));

    return NextResponse.json({
      success: true,
      logs: sanitizedLogs,
    });
  } catch (error) {
    console.error('Admin audit logs API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve audit logs.' },
      { status: 500 }
    );
  }
}
