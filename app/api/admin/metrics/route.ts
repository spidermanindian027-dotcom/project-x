import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import { logger } from '@/lib/logger';

export async function GET() {
  const requestId = crypto.randomUUID();
  try {
    const actor = await getCurrentUser();
    if (!actor) {
      await logger.logSecurity({
        requestId,
        event: 'UNAUTHORIZED_METRICS_ACCESS',
        route: '/api/admin/metrics',
        method: 'GET',
        details: { reason: 'No active session' },
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    if (actor.role !== Role.ADMIN) {
      await logger.logSecurity({
        requestId,
        event: 'FORBIDDEN_ADMIN_ACCESS',
        route: '/api/admin/metrics',
        method: 'GET',
        userId: actor.id,
        details: { userRole: actor.role },
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Administrator privileges required.',
        },
        { status: 403 }
      );
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    // Parallel aggregation of operational metrics
    const [
      totalUsers,
      activeSessionsCount,
      totalOutfitAnalyses,
      analysesAgg,
      totalWardrobeItems,
      totalTryOnJobs,
      totalSecurityEvents,
      recentUsers,
      wardrobeByCategory,
      securityBySeverity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({
        where: {
          expiresAt: { gt: new Date() },
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.outfitAnalysis.count(),
      prisma.outfitAnalysis.aggregate({
        _avg: {
          overallScore: true,
        },
      }),
      prisma.wardrobeItem.count(),
      prisma.tryOnJob.count(),
      prisma.securityAuditLog.count(),
      prisma.user.findMany({
        where: {
          createdAt: { gte: fourteenDaysAgo },
        },
        select: {
          createdAt: true,
        },
      }),
      prisma.wardrobeItem.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
      }),
      prisma.securityAuditLog.groupBy({
        by: ['severity'],
        _count: {
          id: true,
        },
      }),
    ]);

    // Format registration trends (last 14 days grouped by day)
    const trendsMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      trendsMap[key] = 0;
    }
    for (const u of recentUsers) {
      const dayKey = u.createdAt.toISOString().slice(0, 10);
      if (trendsMap[dayKey] !== undefined) {
        trendsMap[dayKey]++;
      }
    }
    const registrationTrends = Object.entries(trendsMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Format Category breakdown
    const categoryBreakdown = wardrobeByCategory.map((c) => ({
      category: c.category,
      count: c._count.id,
    }));

    // Format Error/Incident summary
    const errorSummary = securityBySeverity.map((s) => ({
      severity: s.severity,
      count: s._count.id,
    }));

    const averageOutfitScore = analysesAgg._avg.overallScore
      ? Math.round(analysesAgg._avg.overallScore * 10) / 10
      : null;

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers: activeSessionsCount,
        totalOutfitAnalyses,
        averageOutfitScore,
        totalWardrobeItems,
        totalTryOnJobs,
        totalSecurityEvents,
        registrationTrends,
        categoryBreakdown,
        errorSummary,
      },
    });
  } catch (error) {
    console.error('Admin metrics API error:', error);
    await logger.logError({
      requestId,
      event: 'ADMIN_METRICS_ERROR',
      route: '/api/admin/metrics',
      method: 'GET',
      details: { error: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json(
      { success: false, error: 'Failed to calculate platform metrics.' },
      { status: 500 }
    );
  }
}
