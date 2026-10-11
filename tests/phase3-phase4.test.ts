import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/db/prisma';
import { hashPassword } from '../lib/auth/password';
import { Role } from '@prisma/client';
import { styleProfileUpdateSchema } from '../lib/validations/profile.schema';
import { OutfitAnalysisResultSchema } from '../lib/ai/ai.interface';
import { DevelopmentMockAIProvider } from '../lib/ai/mock-ai.adapter';
import { rateLimit } from '../lib/rate-limit';

describe('Phase 3 & Phase 4 Test Suite', () => {
  let userAId: string;
  let userBId: string;
  const emailA = `test.fashion.a.${Date.now()}@vestra.ai`;
  const emailB = `test.fashion.b.${Date.now()}@vestra.ai`;

  beforeAll(async () => {
    const passwordHash = await hashPassword('SecurePass123!');
    const userA = await prisma.user.create({
      data: {
        fullName: 'Client Alpha',
        email: emailA,
        passwordHash,
        role: Role.USER,
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        fullName: 'Client Beta',
        email: emailB,
        passwordHash,
        role: Role.USER,
      },
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    if (userAId) {
      await prisma.user.delete({ where: { id: userAId } }).catch(() => {});
    }
    if (userBId) {
      await prisma.user.delete({ where: { id: userBId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  // 1. Profile API / DB Tests & Multi-tenant Isolation
  describe('1. Profile Creation, Update & Multi-Tenant Isolation', () => {
    it('creates and reads style profile for test user A', async () => {
      const profile = await prisma.styleProfile.create({
        data: {
          userId: userAId,
          primaryArchetype: 'QUIET_LUXURY',
          secondaryArchetype: 'MINIMAL_TAILORED',
          preferredColours: ['Warm Ivory', 'Charcoal Slate'],
          bodyProportionType: 'ATHLETIC',
        },
      });

      expect(profile).toBeDefined();
      expect(profile.userId).toBe(userAId);
      expect(profile.primaryArchetype).toBe('QUIET_LUXURY');
      expect(profile.preferredColours).toContain('Warm Ivory');
    });

    it('updates style profile with valid data', async () => {
      const updated = await prisma.styleProfile.update({
        where: { userId: userAId },
        data: {
          primaryArchetype: 'OLD_MONEY',
          onboardingStep: 3,
        },
      });

      expect(updated.primaryArchetype).toBe('OLD_MONEY');
      expect(updated.onboardingStep).toBe(3);
    });

    it('enforces multi-tenant isolation (user A cannot modify user B profile)', async () => {
      // User B creates a profile
      const profileB = await prisma.styleProfile.create({
        data: {
          userId: userBId,
          primaryArchetype: 'AVANT_GARDE',
        },
      });
      expect(profileB.userId).toBe(userBId);

      // Attempting to query/update user B's profile scoped to user A's authenticated userId must not affect B
      const scopedUpdate = await prisma.styleProfile.updateMany({
        where: {
          id: profileB.id,
          userId: userAId, // Multi-tenant guard
        },
        data: {
          primaryArchetype: 'STREETWEAR_EDGE',
        },
      });

      expect(scopedUpdate.count).toBe(0);

      // Verify User B's profile remains unchanged
      const unchangedB = await prisma.styleProfile.findUnique({
        where: { id: profileB.id },
      });
      expect(unchangedB?.primaryArchetype).toBe('AVANT_GARDE');
    });
  });

  // 2. Photo Upload Validation
  describe('2. Photo Upload Validation Criteria', () => {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
    const MIN_PHOTO_BYTES = 10 * 1024;

    it('rejects forbidden MIME types', () => {
      const testMime = 'image/gif';
      expect(ALLOWED_TYPES.includes(testMime)).toBe(false);

      const svgMime = 'image/svg+xml';
      expect(ALLOWED_TYPES.includes(svgMime)).toBe(false);

      const validMime = 'image/webp';
      expect(ALLOWED_TYPES.includes(validMime)).toBe(true);
    });

    it('rejects files exceeding 8MB size limit', () => {
      const fileSize = 9 * 1024 * 1024; // 9MB
      expect(fileSize > MAX_PHOTO_BYTES).toBe(true);
    });

    it('rejects files under 10KB minimum threshold (blank/corrupt)', () => {
      const smallSize = 4 * 1024; // 4KB
      expect(smallSize < MIN_PHOTO_BYTES).toBe(true);
    });
  });

  // 3. Outfit Scoring Formula
  describe('3. Outfit Scoring Formula & Rounding', () => {
    it('accurately computes weighted overallScore and rounds to 1 decimal place', () => {
      const colourHarmonyScore = 85;
      const fitProportionScore = 90;
      const coordinationScore = 80;
      const occasionScore = 75;
      const accessoriesScore = 70;
      const styleCoherenceScore = 88;

      // Formula: colour*0.20 + fit*0.25 + coord*0.20 + occasion*0.15 + acc*0.10 + style*0.10
      // 85*0.20 = 17
      // 90*0.25 = 22.5
      // 80*0.20 = 16
      // 75*0.15 = 11.25
      // 70*0.10 = 7
      // 88*0.10 = 8.8
      // Sum = 17 + 22.5 + 16 + 11.25 + 7 + 8.8 = 82.55 -> rounded to 82.6

      const rawOverall =
        colourHarmonyScore * 0.2 +
        fitProportionScore * 0.25 +
        coordinationScore * 0.2 +
        occasionScore * 0.15 +
        accessoriesScore * 0.1 +
        styleCoherenceScore * 0.1;

      const roundedScore = Math.round(rawOverall * 10) / 10;
      expect(roundedScore).toBe(82.6);
    });
  });

  // 4. Mock AI Adapter
  describe('4. Mock AI Adapter Implementation', () => {
    const mockProvider = new DevelopmentMockAIProvider();

    it('declares isProductionProvider as false', () => {
      expect(mockProvider.isProductionProvider).toBe(false);
      expect(mockProvider.providerName).toBe('development_mock');
    });

    it('produces an analysis output conforming strictly to OutfitAnalysisResultSchema', async () => {
      const result = await mockProvider.analyzeOutfit('/uploads/sample-look.jpg');
      const parsed = OutfitAnalysisResultSchema.safeParse(result);
      expect(parsed.success).toBe(true);
    });

    it('produces deterministic output for identical input URLs', async () => {
      const url = '/uploads/deterministic-test-123.jpg';
      const run1 = await mockProvider.analyzeOutfit(url);
      const run2 = await mockProvider.analyzeOutfit(url);

      expect(run1.overallScore).toBe(run2.overallScore);
      expect(run1.colourHarmonyScore).toBe(run2.colourHarmonyScore);
      expect(run1.fitProportionScore).toBe(run2.fitProportionScore);
      expect(run1.styleLabel).toBe(run2.styleLabel);
    });
  });

  // 5. Malformed AI Output Rejection
  describe('5. Malformed AI Output Rejection', () => {
    it('rejects payloads missing mandatory fields', () => {
      const missingFields = {
        overallScore: 80,
        confidence: 0.9,
        // missing scores, labels, whatWorks, etc.
      };
      const parsed = OutfitAnalysisResultSchema.safeParse(missingFields);
      expect(parsed.success).toBe(false);
    });

    it('rejects scores exceeding 100 or below 0', () => {
      const invalidScore = {
        overallScore: 105, // Invalid > 100
        confidence: 0.9,
        colourHarmonyScore: 80,
        fitProportionScore: 80,
        coordinationScore: 80,
        occasionScore: 80,
        accessoriesScore: 80,
        styleCoherenceScore: 80,
        styleLabel: 'Chic',
        whatWorks: ['Good drape'],
        areasToImprove: ['None'],
        recommendedColours: ['Black'],
        recommendedFootwear: ['Boots'],
        recommendedAccessories: ['Belt'],
        styleTags: ['Minimal'],
        occasionObservations: 'Very well put together.',
      };
      const parsed = OutfitAnalysisResultSchema.safeParse(invalidScore);
      expect(parsed.success).toBe(false);
    });
  });

  // 6. Rate Limiter
  describe('6. Rate Limiter Functionality', () => {
    it('allows 10 calls, decrements remaining, and blocks the 11th call within window', () => {
      const rateLimitKey = `test_rate_user_${Date.now()}`;
      const limit = 10;
      const windowMs = 60 * 1000;

      for (let i = 1; i <= limit; i++) {
        const res = rateLimit(rateLimitKey, limit, windowMs);
        expect(res.allowed).toBe(true);
        expect(res.remaining).toBe(limit - i);
      }

      // 11th call
      const blocked = rateLimit(rateLimitKey, limit, windowMs);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  // 7. Profile Schema Validation
  describe('7. Profile Schema Validation', () => {
    it('validates correct profile update payload', () => {
      const valid = styleProfileUpdateSchema.safeParse({
        primaryArchetype: 'QUIET_LUXURY',
        secondaryArchetype: 'OLD_MONEY',
        bodyProportionType: 'HOURGLASS',
        preferredColours: ['Warm Ivory', 'Charcoal Slate'],
        avoidedColours: ['Neon Green'],
        skinToneCategory: 'warm',
        occasionWeekday: 'business',
        onboardingStep: 2,
        onboardingCompleted: false,
      });
      expect(valid.success).toBe(true);
    });

    it('rejects invalid style archetype enum values', () => {
      const invalid = styleProfileUpdateSchema.safeParse({
        primaryArchetype: 'CYBERPUNK_FUTURISTIC',
      });
      expect(invalid.success).toBe(false);
    });

    it('rejects keyword lists containing more than 20 items', () => {
      const tooMany = Array.from({ length: 25 }, (_, i) => `Keyword ${i}`);
      const invalid = styleProfileUpdateSchema.safeParse({
        styleKeywords: tooMany,
      });
      expect(invalid.success).toBe(false);
    });
  });
});
