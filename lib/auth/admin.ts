import prisma from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { sanitizeUser, type SafeUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export interface AdminProvisionResult {
  status: 'created' | 'updated' | 'already_exists';
  user: SafeUser;
}

/**
 * Server-side trusted provisioning of the default Administrator account.
 * Reads strictly from server environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME).
 * Never exposes credentials to client bundles.
 */
export async function provisionAdminUser(): Promise<AdminProvisionResult> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || 'Atelier Director';

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Server configuration error: ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables.'
    );
  }

  if (adminPassword.length < 8) {
    throw new Error(
      'Server configuration error: ADMIN_PASSWORD must be at least 8 characters long.'
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    // If the account exists, ensure it is assigned the ADMIN role
    if (existingUser.role !== Role.ADMIN) {
      const updated = await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.ADMIN },
      });
      return { status: 'updated', user: sanitizeUser(updated) };
    }
    return { status: 'already_exists', user: sanitizeUser(existingUser) };
  }

  // Provision new administrator
  const passwordHash = await hashPassword(adminPassword);
  const newUser = await prisma.user.create({
    data: {
      email: adminEmail,
      fullName: adminName,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  return { status: 'created', user: sanitizeUser(newUser) };
}

/**
 * Enforces role assignment authorization.
 * Only an active ADMIN can change role assignments.
 * Prevents ordinary users from elevating themselves or changing other users' roles.
 */
export function assertCanManageRoles(actor: SafeUser): void {
  if (actor.role !== Role.ADMIN) {
    throw new Error(
      'Forbidden: Only an authorized Administrator can modify user roles.'
    );
  }
}
