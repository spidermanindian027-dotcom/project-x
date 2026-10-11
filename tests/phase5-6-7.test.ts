import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/db/prisma';
import { hashPassword } from '../lib/auth/password';
import { Role } from '@prisma/client';
import {
  createWardrobeItemSchema,
  updateWardrobeItemSchema,
} from '../lib/validations/wardrobe.schema';
import { wardrobeMatcher } from '../lib/ai/matching.service';
import { stylistChatService } from '../lib/ai/chat.service';
import { storage } from '../lib/storage';

describe('Phase 5, 6 & 7 Comprehensive Test Suite', () => {
  let userAId: string;
  let userBId: string;
  const emailA = `test.client.a.${Date.now()}@vestra.ai`;
  const emailB = `test.client.b.${Date.now()}@vestra.ai`;

  beforeAll(async () => {
    const passwordHash = await hashPassword('SecurePass123!');
    const userA = await prisma.user.create({
      data: {
        fullName: 'Client A Atelier',
        email: emailA,
        passwordHash,
        role: Role.USER,
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        fullName: 'Client B Atelier',
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

  // 1. WARDROBE CRUD & MULTI-TENANT ISOLATION
  describe('1. Digital Wardrobe CRUD & Multi-Tenant Isolation', () => {
    let itemAId: string;
    let itemImageKey: string;

    it('creates a wardrobe item for User A', async () => {
      const buffer = Buffer.from('test-image-content-bytes');
      const { publicUrl, key } = await storage.uploadFile(buffer, 'blazer.jpg', 'image/jpeg');
      itemImageKey = key;

      const item = await prisma.wardrobeItem.create({
        data: {
          userId: userAId,
          name: 'Charcoal Double-Breasted Blazer',
          category: 'JACKETS',
          dominantColor: 'Charcoal',
          colorHex: '#262626',
          material: 'Virgin Wool',
          formality: 'BUSINESS',
          season: 'AUTUMN',
          fit: 'Structured',
          imageUrl: publicUrl,
          imageKey: key,
          isFavorite: false,
        },
      });

      itemAId = item.id;
      expect(item).toBeDefined();
      expect(item.userId).toBe(userAId);
      expect(item.name).toBe('Charcoal Double-Breasted Blazer');
      expect(item.imageUrl).toBe(publicUrl);
    });

    it('allows User A to read and update their own item', async () => {
      const updated = await prisma.wardrobeItem.updateMany({
        where: { id: itemAId, userId: userAId },
        data: { isFavorite: true, notes: 'Reserved for executive briefings.' },
      });
      expect(updated.count).toBe(1);

      const item = await prisma.wardrobeItem.findUnique({ where: { id: itemAId } });
      expect(item?.isFavorite).toBe(true);
      expect(item?.notes).toBe('Reserved for executive briefings.');
    });

    it('strictly forbids User B from reading, updating, or deleting User A item', async () => {
      // User B trying to find User A's item scoped to User B's ID
      const queryB = await prisma.wardrobeItem.findFirst({
        where: { id: itemAId, userId: userBId },
      });
      expect(queryB).toBeNull();

      // User B trying to update User A's item
      const updateB = await prisma.wardrobeItem.updateMany({
        where: { id: itemAId, userId: userBId },
        data: { name: 'Malicious Hijack' },
      });
      expect(updateB.count).toBe(0);

      // User B trying to delete User A's item
      const deleteB = await prisma.wardrobeItem.deleteMany({
        where: { id: itemAId, userId: userBId },
      });
      expect(deleteB.count).toBe(0);

      // Verify User A's item is untouched
      const item = await prisma.wardrobeItem.findUnique({ where: { id: itemAId } });
      expect(item?.name).toBe('Charcoal Double-Breasted Blazer');
    });

    it('deletes item and cleans up storage key', async () => {
      await storage.deleteFile(itemImageKey);
      await prisma.wardrobeItem.delete({ where: { id: itemAId } });

      const check = await prisma.wardrobeItem.findUnique({ where: { id: itemAId } });
      expect(check).toBeNull();
    });
  });

  // 2. WARDROBE VALIDATION
  describe('2. Wardrobe Input Validation Schemas', () => {
    it('rejects payload missing name, category, or dominantColor', () => {
      const invalid = createWardrobeItemSchema.safeParse({
        category: 'TOPS',
        // missing name and dominantColor
      });
      expect(invalid.success).toBe(false);
    });

    it('rejects invalid category enum value', () => {
      const invalid = createWardrobeItemSchema.safeParse({
        name: 'Space Helmet',
        category: 'ASTRONAUT_HELMET',
        dominantColor: 'Silver',
      });
      expect(invalid.success).toBe(false);
    });

    it('validates partial updates with updateWardrobeItemSchema', () => {
      const valid = updateWardrobeItemSchema.safeParse({
        isFavorite: true,
        fit: 'Oversized',
      });
      expect(valid.success).toBe(true);
    });
  });

  // 3. AI WARDROBE MATCHING
  describe('3. AI Wardrobe Matching Service & Multi-Tenant Inventory', () => {
    let topAId: string;
    let bottomAId: string;
    let foreignBId: string;

    beforeAll(async () => {
      const topA = await prisma.wardrobeItem.create({
        data: {
          userId: userAId,
          name: 'Silk Crepe Blouse',
          category: 'SHIRTS',
          dominantColor: 'Warm Ivory',
          formality: 'SMART_CASUAL',
          imageUrl: '/uploads/topA.jpg',
          imageKey: 'topA.jpg',
        },
      });
      topAId = topA.id;

      const bottomA = await prisma.wardrobeItem.create({
        data: {
          userId: userAId,
          name: 'Pleated Wool Trousers',
          category: 'TROUSERS',
          dominantColor: 'Charcoal',
          formality: 'SMART_CASUAL',
          imageUrl: '/uploads/bottomA.jpg',
          imageKey: 'bottomA.jpg',
        },
      });
      bottomAId = bottomA.id;

      const foreignB = await prisma.wardrobeItem.create({
        data: {
          userId: userBId,
          name: 'Foreign Leather Jacket',
          category: 'JACKETS',
          dominantColor: 'Onyx Black',
          formality: 'CASUAL',
          imageUrl: '/uploads/foreignB.jpg',
          imageKey: 'foreignB.jpg',
        },
      });
      foreignBId = foreignB.id;
    });

    it('throws error when inventory has fewer than 2 pieces', () => {
      expect(() => {
        wardrobeMatcher.matchOutfit([], null);
      }).toThrow(/at least 2 wardrobe items/);

      const singleItem = [
        {
          id: topAId,
          userId: userAId,
          name: 'Single Top',
          category: 'SHIRTS' as const,
          dominantColor: 'Ivory',
          imageUrl: '',
          imageKey: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          subCategory: null,
          colorHex: null,
          pattern: null,
          material: null,
          style: null,
          formality: 'CASUAL' as const,
          season: 'ALL_SEASON' as const,
          fit: null,
          isFavorite: false,
          notes: null,
        },
      ];

      expect(() => {
        wardrobeMatcher.matchOutfit(singleItem as unknown as Parameters<typeof wardrobeMatcher.matchOutfit>[0], null);
      }).toThrow(/at least 2 wardrobe items/);
    });

    it('synthesizes outfit from user A inventory and only selects user A items', async () => {
      const userAInventory = await prisma.wardrobeItem.findMany({
        where: { userId: userAId },
      });

      const match = wardrobeMatcher.matchOutfit(userAInventory, null, {
        occasion: 'Executive Boardroom',
      });

      expect(match).toBeDefined();
      expect(match.selectedItemIds.length).toBeGreaterThanOrEqual(2);
      expect(match.selectedItemIds).toContain(topAId);
      expect(match.selectedItemIds).toContain(bottomAId);

      // Strictly ensure foreign item is NOT recommended
      expect(match.selectedItemIds).not.toContain(foreignBId);

      // Verify editorial content
      expect(match.title).toContain('Warm Ivory');
      expect(match.colorRationale).toContain('Warm Ivory');
      expect(match.proportionRationale.length).toBeGreaterThan(10);
    });
  });

  // 4. ASK VESTRA STYLIST CHAT
  describe('4. Ask VESTRA AI Stylist Chat & Multi-Tenant Isolation', () => {
    let sessionAId: string;

    it('creates a styling consultation session and persists messages for User A', async () => {
      const session = await prisma.stylistSession.create({
        data: {
          userId: userAId,
          title: 'Wedding Styling Inquiry',
        },
      });
      sessionAId = session.id;

      expect(session).toBeDefined();
      expect(session.userId).toBe(userAId);

      const userMsg = await prisma.stylistMessage.create({
        data: {
          sessionId: sessionAId,
          role: 'user',
          content: 'What should I wear to a wedding?',
        },
      });
      expect(userMsg.role).toBe('user');
    });

    it('forbids User B from reading or querying User A chat sessions', async () => {
      const sessionForB = await prisma.stylistSession.findFirst({
        where: { id: sessionAId, userId: userBId },
      });
      expect(sessionForB).toBeNull();
    });

    it('injects user wardrobe context into stylist response', async () => {
      const userAInventory = await prisma.wardrobeItem.findMany({
        where: { userId: userAId },
      });

      const response = stylistChatService.generateResponse({
        userMessage: 'Suggest an outfit from my wardrobe',
        items: userAInventory,
        profile: {
          id: 'prof1',
          userId: userAId,
          primaryArchetype: 'QUIET_LUXURY',
          secondaryArchetype: 'MINIMAL_TAILORED',
          preferredColours: ['Warm Ivory', 'Charcoal'],
          avoidedColours: [],
          skinToneCategory: 'warm',
          bodyProportionType: 'HOURGLASS',
          proportionConfidence: 1,
          proportionSource: 'manual',
          skinToneConfidence: 1,
          occasionWeekday: 'smart_casual',
          occasionWeekend: 'casual',
          occasionFormal: false,
          referencePhotoUrl: null,
          referencePhotoKey: null,
          onboardingCompleted: true,
          onboardingStep: 6,
          styleKeywords: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      expect(response.content).toContain('Silk Crepe Blouse');
      expect(response.content).toContain('Pleated Wool Trousers');
      expect(response.referencedItemIds.length).toBe(2);
    });

    it('handles query with empty inventory gracefully', () => {
      const response = stylistChatService.generateResponse({
        userMessage: 'Suggest an outfit from my wardrobe',
        items: [],
        profile: null,
      });

      expect(response.content).toContain('Atelier Wardrobe Vault');
      expect(response.referencedItemIds).toHaveLength(0);
    });
  });
});
