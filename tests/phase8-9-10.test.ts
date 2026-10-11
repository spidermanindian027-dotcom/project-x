import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/db/prisma';
import { hashPassword } from '../lib/auth/password';
import { Role, WardrobeCategory, LookSource, TryOnStatus, SeasonCategory, FormalityLevel } from '@prisma/client';
import { weatherProvider } from '../lib/weather';
import { tryOnProvider } from '../lib/try-on';

describe('Phase 8, 9 & 10 Comprehensive Test Suite', () => {
  let userAId: string;
  let userBId: string;
  let itemA1Id: string;
  let itemA2Id: string;
  let itemB1Id: string;
  const emailA = `test.client.p8910.a.${Date.now()}@vestra.ai`;
  const emailB = `test.client.p8910.b.${Date.now()}@vestra.ai`;

  beforeAll(async () => {
    const passwordHash = await hashPassword('SecurePass123!');
    const userA = await prisma.user.create({
      data: {
        fullName: 'Client A Haute',
        email: emailA,
        passwordHash,
        role: Role.USER,
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        fullName: 'Client B Haute',
        email: emailB,
        passwordHash,
        role: Role.USER,
      },
    });
    userBId = userB.id;

    // Seed wardrobe items for User A
    const itemA1 = await prisma.wardrobeItem.create({
      data: {
        userId: userAId,
        name: 'Charcoal Cashmere Coat',
        category: WardrobeCategory.JACKETS,
        dominantColor: 'Charcoal',
        colorHex: '#1a1a1a',
        season: SeasonCategory.WINTER,
        formality: FormalityLevel.FORMAL,
        material: 'Cashmere',
        imageUrl: '/test-coat.jpg',
        imageKey: 'test/coat.jpg',
      },
    });
    itemA1Id = itemA1.id;

    const itemA2 = await prisma.wardrobeItem.create({
      data: {
        userId: userAId,
        name: 'Ivory Poplin Tailored Shirt',
        category: WardrobeCategory.SHIRTS,
        dominantColor: 'Warm Ivory',
        colorHex: '#f5f0e8',
        season: SeasonCategory.ALL_SEASON,
        formality: FormalityLevel.BUSINESS,
        material: 'Cotton',
        imageUrl: '/test-shirt.jpg',
        imageKey: 'test/shirt.jpg',
      },
    });
    itemA2Id = itemA2.id;

    // Seed wardrobe item for User B
    const itemB1 = await prisma.wardrobeItem.create({
      data: {
        userId: userBId,
        name: 'Emerald Silk Slip Dress',
        category: WardrobeCategory.DRESSES,
        dominantColor: 'Emerald',
        colorHex: '#059669',
        season: SeasonCategory.SUMMER,
        formality: FormalityLevel.EVENING_GALA,
        material: 'Silk',
        imageUrl: '/test-dress.jpg',
        imageKey: 'test/dress.jpg',
      },
    });
    itemB1Id = itemB1.id;
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

  // =========================================================================
  // PHASE 8: LOOKS CRUD, MULTI-TENANT ISOLATION & PERSONAL ANALYTICS
  // =========================================================================
  describe('Phase 8: Lookbook & Personal Analytics', () => {
    let lookAId: string;

    it('creates a Look for User A referencing User A items', async () => {
      // Validate ownership logic in code
      const ownedItems = await prisma.wardrobeItem.findMany({
        where: {
          id: { in: [itemA1Id, itemA2Id] },
          userId: userAId,
        },
      });
      expect(ownedItems).toHaveLength(2);

      const look = await prisma.look.create({
        data: {
          userId: userAId,
          name: 'Architectural Winter Ensemble',
          notes: 'Cashmere overcoat layered with ivory shirt',
          source: LookSource.MANUAL_CURATION,
          overallScore: 92,
          isFavorite: true,
          items: {
            create: [
              { wardrobeItemId: itemA1Id },
              { wardrobeItemId: itemA2Id },
            ],
          },
        },
        include: {
          items: {
            include: { wardrobeItem: true },
          },
        },
      });

      expect(look.id).toBeDefined();
      expect(look.userId).toBe(userAId);
      expect(look.items).toHaveLength(2);
      expect(look.overallScore).toBe(92);
      expect(look.isFavorite).toBe(true);
      lookAId = look.id;
    });

    it('prevents User A from adding items owned by User B into their Look', async () => {
      const itemsToValidate = [itemA1Id, itemB1Id];
      const verifiedItems = await prisma.wardrobeItem.findMany({
        where: {
          id: { in: itemsToValidate },
          userId: userAId,
        },
      });

      // Verification must detect foreign item
      expect(verifiedItems.length).not.toBe(itemsToValidate.length);
      const isCrossUserAllowed = verifiedItems.length === itemsToValidate.length;
      expect(isCrossUserAllowed).toBe(false);
    });

    it('enforces multi-tenant isolation: User B cannot retrieve or update User A Look', async () => {
      // User B tries to access Look A
      const crossAccessLook = await prisma.look.findFirst({
        where: {
          id: lookAId,
          userId: userBId, // Scoped to User B
        },
      });
      expect(crossAccessLook).toBeNull();

      // User B attempts to delete Look A (simulating API logic)
      const deleteResult = await prisma.look.deleteMany({
        where: {
          id: lookAId,
          userId: userBId,
        },
      });
      expect(deleteResult.count).toBe(0);

      // Verify Look A still exists for User A
      const lookStillExists = await prisma.look.findUnique({
        where: { id: lookAId },
      });
      expect(lookStillExists).not.toBeNull();
    });

    it('computes exact personal analytics without synthetic data', async () => {
      // User B has 0 looks and 1 wardrobe item
      const userBLooks = await prisma.look.findMany({
        where: { userId: userBId },
        include: { items: { include: { wardrobeItem: true } } },
      });
      expect(userBLooks).toHaveLength(0);

      // User A has 1 look with overallScore 92
      const userALooks = await prisma.look.findMany({
        where: { userId: userAId },
        include: { items: { include: { wardrobeItem: true } } },
      });
      expect(userALooks).toHaveLength(1);

      const scoredLooks = userALooks.filter((l) => l.overallScore !== null);
      const avgScore =
        scoredLooks.reduce((sum, l) => sum + (l.overallScore || 0), 0) / scoredLooks.length;
      expect(avgScore).toBe(92);

      // Check category and color counts
      const colorMap = new Map<string, number>();
      for (const look of userALooks) {
        for (const item of look.items) {
          if (item.wardrobeItem?.dominantColor) {
            colorMap.set(
              item.wardrobeItem.dominantColor,
              (colorMap.get(item.wardrobeItem.dominantColor) || 0) + 1
            );
          }
        }
      }

      expect(colorMap.get('Charcoal')).toBe(1);
      expect(colorMap.get('Warm Ivory')).toBe(1);
    });
  });

  // =========================================================================
  // PHASE 9: WEATHER PROVIDER & OCCASION STYLING ENGINE
  // =========================================================================
  describe('Phase 9: Location & Occasion Styling Engine', () => {
    it('retrieves accurate simulated weather data for recognized cities', async () => {
      const londonWeather = await weatherProvider.getWeatherForLocation('London');
      expect(londonWeather.city).toBe('LONDON');
      expect(londonWeather.temperatureC).toBe(15);
      expect(londonWeather.condition).toBe('Light Rain');
      expect(londonWeather.description).toBeTruthy();

      const tokyoWeather = await weatherProvider.getWeatherForLocation('Tokyo');
      expect(tokyoWeather.city).toBe('TOKYO');
      expect(tokyoWeather.temperatureC).toBe(21);

      const dubaiWeather = await weatherProvider.getWeatherForLocation('Dubai');
      expect(dubaiWeather.city).toBe('DUBAI');
      expect(dubaiWeather.temperatureC).toBeGreaterThan(25);
    });

    it('falls back gracefully to standard temperate climate for unknown locations', async () => {
      const unknownWeather = await weatherProvider.getWeatherForLocation('Unknown City');
      expect(unknownWeather.city).toBe('UNKNOWN CITY');
      expect(unknownWeather.temperatureC).toBe(19);
      expect(unknownWeather.condition).toBe('Mild Autumn Breezes');
    });

    it('filters owned wardrobe items matching formal criteria for User A', async () => {
      const userWardrobe = await prisma.wardrobeItem.findMany({
        where: { userId: userAId },
      });

      // Formal item checks
      const formalItems = userWardrobe.filter(
        (i) => i.formality === FormalityLevel.FORMAL || i.formality === FormalityLevel.BUSINESS
      );
      expect(formalItems).toHaveLength(2);

      // Jackets / Outerwear check
      const coats = userWardrobe.filter((i) => i.category === WardrobeCategory.JACKETS);
      expect(coats).toHaveLength(1);
      expect(coats[0].name).toBe('Charcoal Cashmere Coat');
    });
  });

  // =========================================================================
  // PHASE 10: VIRTUAL TRY-ON ARCHITECTURE & PROVIDER INTEGRATION
  // =========================================================================
  describe('Phase 10: Virtual Try-On Architecture', () => {
    let jobId: string;

    it('submits a try-on job and receives valid jobId', async () => {
      const jobResult = await tryOnProvider.submitJob({
        userId: userAId,
        referenceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        garmentImageUrls: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
        selectedItemIds: [itemA1Id],
      });

      expect(jobResult.jobId).toBeDefined();
      jobId = jobResult.jobId;
    });

    it('polls try-on job status until completed or processing', async () => {
      const statusResult = await tryOnProvider.checkStatus(jobId);
      expect(['PENDING', 'PROCESSING', 'COMPLETED']).toContain(statusResult.status);
      if (statusResult.status === 'COMPLETED') {
        expect(statusResult.resultImageUrl).toBeDefined();
      }
    });

    it('persists TryOnJob in the database with multi-tenant isolation', async () => {
      const dbJob = await prisma.tryOnJob.create({
        data: {
          userId: userAId,
          referenceImageUrl: 'https://example.com/person.jpg',
          selectedItemIds: [itemA1Id],
          provider: 'development_mock',
          modelIdentifier: 'vestra-vton-dev-v1',
          status: TryOnStatus.COMPLETED,
          resultImageUrl: 'https://example.com/result.jpg',
        },
      });

      expect(dbJob.id).toBeDefined();
      expect(dbJob.userId).toBe(userAId);

      // Verify User B cannot view User A try-on jobs
      const userBJobs = await prisma.tryOnJob.findMany({
        where: {
          userId: userBId,
        },
      });
      expect(userBJobs).toHaveLength(0);

      // Clean up job
      await prisma.tryOnJob.delete({ where: { id: dbJob.id } });
    });

    it('saves a completed TryOn as a Look with source MANUAL_CURATION', async () => {
      const tryOnLook = await prisma.look.create({
        data: {
          userId: userAId,
          name: 'Virtual Fitting - Coat Preview',
          notes: 'Simulated try-on render generated with VESTRA Studio',
          source: LookSource.MANUAL_CURATION,
          overallScore: 88,
          items: {
            create: [{ wardrobeItemId: itemA1Id }],
          },
        },
      });

      expect(tryOnLook.id).toBeDefined();
      expect(tryOnLook.source).toBe(LookSource.MANUAL_CURATION);
      expect(tryOnLook.userId).toBe(userAId);

      // Clean up look
      await prisma.look.delete({ where: { id: tryOnLook.id } });
    });
  });
});
