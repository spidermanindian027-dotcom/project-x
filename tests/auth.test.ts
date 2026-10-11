import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/db/prisma';
import { hashPassword, verifyPassword } from '../lib/auth/password';
import {
  createSession,
  validateSessionToken,
  invalidateSession,
  sanitizeUser,
} from '../lib/auth/session';
import { provisionAdminUser, assertCanManageRoles } from '../lib/auth/admin';
import { registerSchema, loginSchema, roleUpdateSchema } from '../lib/validations/auth.schema';
import { Role } from '@prisma/client';

describe('Phase 2 Authentication & Database Test Suite', () => {
  const testEmail = `test.user.${Date.now()}@vestra.ai`;
  const testPassword = 'SecurePassword123!';
  let createdUserId: string;

  beforeAll(async () => {
    // Ensure clean state for test email
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, 'temp.user@vestra.ai'] } },
    });
  });

  afterAll(async () => {
    // Cleanup created test records
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await prisma.user.deleteMany({
      where: { email: 'temp.user@vestra.ai' },
    });
    await prisma.$disconnect();
  });

  describe('1. Zod Input Validation', () => {
    it('validates correct registration input', () => {
      const valid = registerSchema.safeParse({
        fullName: 'Claire Underwood',
        email: 'claire@vestra.ai',
        password: 'StrongPassword1',
      });
      expect(valid.success).toBe(true);
    });

    it('rejects invalid email formats', () => {
      const invalid = registerSchema.safeParse({
        fullName: 'Claire Underwood',
        email: 'not-an-email',
        password: 'StrongPassword1',
      });
      expect(invalid.success).toBe(false);
    });

    it('rejects passwords under 8 characters or missing numbers/letters', () => {
      const tooShort = registerSchema.safeParse({
        fullName: 'Claire Underwood',
        email: 'claire@vestra.ai',
        password: 'short',
      });
      expect(tooShort.success).toBe(false);

      const noNumber = registerSchema.safeParse({
        fullName: 'Claire Underwood',
        email: 'claire@vestra.ai',
        password: 'OnlyLettersPassword',
      });
      expect(noNumber.success).toBe(false);
    });

    it('validates login schema properly', () => {
      const valid = loginSchema.safeParse({
        email: 'user@vestra.ai',
        password: 'anyPassword',
      });
      expect(valid.success).toBe(true);

      const invalid = loginSchema.safeParse({
        email: 'invalid-email',
        password: '',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('2. Password Hashing & Security', () => {
    it('hashes passwords with bcrypt and never stores plaintext', async () => {
      const raw = 'SuperSecret123!';
      const hash = await hashPassword(raw);

      expect(hash).not.toBe(raw);
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // Valid bcrypt hash structure
      expect(await verifyPassword(raw, hash)).toBe(true);
      expect(await verifyPassword('WrongPassword123!', hash)).toBe(false);
    });
  });

  describe('3. User Registration & Duplicate Email Protection', () => {
    it('creates a user with hashed password and default USER role', async () => {
      const passwordHash = await hashPassword(testPassword);
      const user = await prisma.user.create({
        data: {
          fullName: 'Test User',
          email: testEmail,
          passwordHash,
          role: Role.USER, // Enforced default
        },
      });

      createdUserId = user.id;
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.role).toBe(Role.USER);
      expect(user.passwordHash).not.toBe(testPassword);
    });

    it('prevents registration of duplicate emails (Unique constraint)', async () => {
      const passwordHash = await hashPassword('AnotherPassword123!');

      await expect(
        prisma.user.create({
          data: {
            fullName: 'Duplicate User',
            email: testEmail,
            passwordHash,
            role: Role.USER,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('4. Authentication & Credentials Verification', () => {
    it('verifies valid user credentials successfully', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });
      expect(user).not.toBeNull();

      const isValid = await verifyPassword(testPassword, user!.passwordHash);
      expect(isValid).toBe(true);
    });

    it('rejects invalid password credentials', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });
      expect(user).not.toBeNull();

      const isValid = await verifyPassword('IncorrectPassword999!', user!.passwordHash);
      expect(isValid).toBe(false);
    });
  });

  describe('5. Database Sessions, Expiration, and Logout', () => {
    let sessionToken: string;

    it('creates and validates an active server session', async () => {
      const session = await createSession(createdUserId, {
        ipAddress: '127.0.0.1',
        userAgent: 'Vitest Test Agent',
      });

      sessionToken = session.token;
      expect(session.token).toBeDefined();
      expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());

      const validated = await validateSessionToken(sessionToken);
      expect(validated).not.toBeNull();
      expect(validated?.user.id).toBe(createdUserId);
      expect(validated?.user.email).toBe(testEmail);
      expect(validated?.session.id).toBe(session.id);
    });

    it('rejects and purges expired sessions', async () => {
      // Create a session expired in the past
      const expiredSession = await prisma.session.create({
        data: {
          token: `expired-token-${Date.now()}`,
          userId: createdUserId,
          expiresAt: new Date(Date.now() - 60000), // 1 minute ago
        },
      });

      const validated = await validateSessionToken(expiredSession.token);
      expect(validated).toBeNull();

      // Ensure it was cleaned up
      const checkDeleted = await prisma.session.findUnique({
        where: { id: expiredSession.id },
      });
      expect(checkDeleted).toBeNull();
    });

    it('invalidates session on logout', async () => {
      await invalidateSession(sessionToken);

      const validated = await validateSessionToken(sessionToken);
      expect(validated).toBeNull();
    });
  });

  describe('6. Admin Provisioning & Role Access Control', () => {
    it('provisions admin account with ADMIN role from server environment', async () => {
      const result = await provisionAdminUser();

      expect(['created', 'updated', 'already_exists']).toContain(result.status);
      expect(result.user.role).toBe(Role.ADMIN);
      expect(result.user.email).toBe(process.env.ADMIN_EMAIL!.toLowerCase());
    });

    it('allows ADMIN to manage roles, but forbids ordinary USER', () => {
      const adminUser = sanitizeUser({
        id: 'admin-1',
        email: 'admin@vestra.ai',
        fullName: 'Admin Director',
        passwordHash: 'hash',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const standardUser = sanitizeUser({
        id: 'user-1',
        email: 'client@vestra.ai',
        fullName: 'Elena Vance',
        passwordHash: 'hash',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Admin should not throw
      expect(() => assertCanManageRoles(adminUser)).not.toThrow();

      // Regular user must be forbidden
      expect(() => assertCanManageRoles(standardUser)).toThrow(/Forbidden/);
    });

    it('validates role update payload with strict enum', () => {
      const valid = roleUpdateSchema.safeParse({
        userId: createdUserId,
        role: 'ADMIN',
      });
      expect(valid.success).toBe(true);

      const invalid = roleUpdateSchema.safeParse({
        userId: createdUserId,
        role: 'SUPER_USER_INJECTION',
      });
      expect(invalid.success).toBe(false);
    });
  });
});
