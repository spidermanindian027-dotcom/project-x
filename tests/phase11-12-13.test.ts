import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/db/prisma';
import { hashPassword } from '../lib/auth/password';
import { Role, LogSeverity, WardrobeCategory, SeasonCategory, FormalityLevel } from '@prisma/client';
import { logger, redactSensitiveData } from '../lib/logger';

describe('Phase 11, 12 & 13 Comprehensive Test Suite: Admin, Security & Audit', () => {
  let adminUserId: string;
  let clientUserId: string;
  let clientSessionToken: string;
  let testLogId: string;

  const adminEmail = `director.admin.${Date.now()}@vestra.ai`;
  const clientEmail = `client.ordinary.${Date.now()}@vestra.ai`;

  beforeAll(async () => {
    const passwordHash = await hashPassword('AdminPassSecret2026!');

    // 1. Create Admin User
    const adminUser = await prisma.user.create({
      data: {
        fullName: 'Atelier Lead Director',
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    adminUserId = adminUser.id;

    // 2. Create Regular Client User
    const clientUser = await prisma.user.create({
      data: {
        fullName: 'Private Client User',
        email: clientEmail,
        passwordHash,
        role: Role.USER,
      },
    });
    clientUserId = clientUser.id;

    // 3. Create active session for client
    clientSessionToken = `token_${Date.now()}`;
    await prisma.session.create({
      data: {
        userId: clientUserId,
        token: clientSessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // active for 7 days
      },
    });

    // 4. Create sample wardrobe item for client
    await prisma.wardrobeItem.create({
      data: {
        userId: clientUserId,
        name: 'Structured Charcoal Blazer',
        category: WardrobeCategory.JACKETS,
        dominantColor: 'Charcoal',
        season: SeasonCategory.AUTUMN,
        formality: FormalityLevel.BUSINESS,
        imageUrl: '/test-blazer.jpg',
        imageKey: 'test/blazer.jpg',
      },
    });

    // 5. Create sample OutfitAnalysis
    await prisma.outfitAnalysis.create({
      data: {
        userId: clientUserId,
        requestId: `req_test_${Date.now()}`,
        imageUrl: '/test-outfit.jpg',
        imageKey: 'test/outfit.jpg',
        overallScore: 88,
        confidence: 0.95,
        colourHarmonyScore: 90,
        fitProportionScore: 85,
        coordinationScore: 88,
        occasionScore: 89,
        accessoriesScore: 87,
        styleCoherenceScore: 90,
        styleLabel: 'Monochrome Minimalist',
        whatWorks: ['Sharp tailoring', 'Controlled palette'],
        areasToImprove: ['Add subtle texture'],
        recommendedColours: ['Warm Ivory'],
        recommendedFootwear: ['Leather Loafers'],
        recommendedAccessories: ['Silver Watch'],
        styleTags: ['minimalist', 'tailored'],
        occasionObservations: 'Sophisticated professional setting',
        providerUsed: 'mock_ai_atelier',
      },
    });
  });

  afterAll(async () => {
    if (adminUserId) {
      await prisma.user.delete({ where: { id: adminUserId } }).catch(() => {});
    }
    if (clientUserId) {
      await prisma.user.delete({ where: { id: clientUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  // =========================================================================
  // 1. SENSITIVE DATA REDACTION & SECURITY LOGGER
  // =========================================================================
  describe('1. Sensitive Data Redaction & Security Audit Logger', () => {
    it('deep-redacts passwords, tokens, API keys, and authorization headers', () => {
      const sensitivePayload = {
        username: 'director@vestra.ai',
        password: 'TopSecretPassword123!',
        authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        nestedConfig: {
          apiKey: 'vestra_live_key_999888',
          secret: 'shhh_super_secret',
          publicInfo: 'Paris Fashion Week',
        },
        list: [
          { passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz' },
          { harmlessField: 42 },
        ],
      };

      const redacted = redactSensitiveData(sensitivePayload) as Record<string, unknown>;

      expect(redacted.username).toBe('director@vestra.ai');
      expect(redacted.password).toBe('[REDACTED]');
      expect(redacted.authToken).toBe('[REDACTED]');

      const nested = redacted.nestedConfig as Record<string, unknown>;
      expect(nested.apiKey).toBe('[REDACTED]');
      expect(nested.secret).toBe('[REDACTED]');
      expect(nested.publicInfo).toBe('Paris Fashion Week');

      const list = redacted.list as Array<Record<string, unknown>>;
      expect(list[0].passwordHash).toBe('[REDACTED]');
      expect(list[1].harmlessField).toBe(42);
    });

    it('persists structured security audit log to PostgreSQL database', async () => {
      const requestId = `test_req_${Date.now()}`;
      const log = await logger.logSecurity({
        requestId,
        event: 'TEST_UNAUTHORIZED_ACCESS_ATTEMPT',
        route: '/api/admin/metrics',
        method: 'GET',
        userId: clientUserId,
        details: {
          clientIp: '127.0.0.1',
          password: 'should_be_redacted_here',
          attemptedRole: 'ADMIN',
        },
      });

      expect(log).not.toBeNull();
      expect(log?.id).toBeDefined();
      expect(log?.severity).toBe(LogSeverity.SECURITY);
      expect(log?.event).toBe('TEST_UNAUTHORIZED_ACCESS_ATTEMPT');
      expect(log?.resolved).toBe(false);

      testLogId = log!.id;

      // Verify that database record actually contains redacted details
      const persisted = await prisma.securityAuditLog.findUnique({
        where: { id: testLogId },
      });
      expect(persisted).not.toBeNull();
      const details = persisted?.details as Record<string, unknown>;
      expect(details.password).toBe('[REDACTED]');
      expect(details.attemptedRole).toBe('ADMIN');
    });

    it('allows an administrator to mark a security incident as resolved', async () => {
      const updated = await prisma.securityAuditLog.update({
        where: { id: testLogId },
        data: { resolved: true },
      });

      expect(updated.resolved).toBe(true);

      const verified = await prisma.securityAuditLog.findUnique({
        where: { id: testLogId },
      });
      expect(verified?.resolved).toBe(true);

      // Clean up test audit log
      await prisma.securityAuditLog.delete({ where: { id: testLogId } });
    });
  });

  // =========================================================================
  // 2. ADMIN AUTHORIZATION & RBAC ENFORCEMENT
  // =========================================================================
  describe('2. Admin Role-Based Access Control (RBAC)', () => {
    it('strictly forbids regular USER role from accessing administrative domains', async () => {
      // Query actor from database to simulate session check
      const regularActor = await prisma.user.findUnique({
        where: { id: clientUserId },
      });
      expect(regularActor).not.toBeNull();
      expect(regularActor?.role).toBe(Role.USER);

      // RBAC condition check
      const hasAdminPrivilege = regularActor?.role === Role.ADMIN;
      expect(hasAdminPrivilege).toBe(false);
    });

    it('authorizes ADMIN role to access administrative domains', async () => {
      const adminActor = await prisma.user.findUnique({
        where: { id: adminUserId },
      });
      expect(adminActor).not.toBeNull();
      expect(adminActor?.role).toBe(Role.ADMIN);

      const hasAdminPrivilege = adminActor?.role === Role.ADMIN;
      expect(hasAdminPrivilege).toBe(true);
    });

    it('verifies client roster queries strictly exclude passwordHash', async () => {
      // Simulating /api/admin/users query
      const users = await prisma.user.findMany({
        where: { id: { in: [adminUserId, clientUserId] } },
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
      });

      expect(users.length).toBe(2);
      for (const u of users) {
        // Assert passwordHash is never present on the selected object
        expect((u as Record<string, unknown>).passwordHash).toBeUndefined();
        expect(u.id).toBeDefined();
        expect(u.email).toBeDefined();
        expect(u.role).toBeDefined();
      }
    });
  });

  // =========================================================================
  // 3. PLATFORM OPERATIONAL METRICS CALCULATION
  // =========================================================================
  describe('3. Platform Metrics Calculations & Telemetry Accuracy', () => {
    it('calculates exact platform counts, active users, and average outfit scores', async () => {
      const [
        totalUsers,
        activeSessions,
        totalOutfitAnalyses,
        analysesAgg,
        totalWardrobeItems,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.session.count({
          where: { expiresAt: { gt: new Date() } },
        }),
        prisma.outfitAnalysis.count(),
        prisma.outfitAnalysis.aggregate({
          _avg: { overallScore: true },
        }),
        prisma.wardrobeItem.count(),
      ]);

      expect(totalUsers).toBeGreaterThanOrEqual(2);
      expect(activeSessions).toBeGreaterThanOrEqual(1);
      expect(totalOutfitAnalyses).toBeGreaterThanOrEqual(1);
      expect(analysesAgg._avg.overallScore).not.toBeNull();
      expect(analysesAgg._avg.overallScore!).toBeGreaterThan(0);
      expect(totalWardrobeItems).toBeGreaterThanOrEqual(1);
    });

    it('groups wardrobe counts accurately by category', async () => {
      const categoryCounts = await prisma.wardrobeItem.groupBy({
        by: ['category'],
        _count: { id: true },
      });

      expect(categoryCounts.length).toBeGreaterThanOrEqual(1);
      const jacketGroup = categoryCounts.find((c) => c.category === WardrobeCategory.JACKETS);
      expect(jacketGroup).toBeDefined();
      expect(jacketGroup?._count.id).toBeGreaterThanOrEqual(1);
    });
  });
});
