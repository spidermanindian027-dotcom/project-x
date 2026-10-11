import prisma from '../lib/db/prisma';
import { provisionAdminUser } from '../lib/auth/admin';
import { hashPassword } from '../lib/auth/password';
import { Role } from '@prisma/client';

async function main() {
  console.log('🌱 Starting VESTRA AI database seed...');

  // 1. Provision Administrator using trusted server environment
  try {
    const adminResult = await provisionAdminUser();
    console.log(
      `✔ Admin provisioning: [${adminResult.status}] -> ${adminResult.user.email} (${adminResult.user.role})`
    );
  } catch (error) {
    console.warn('⚠️ Admin provisioning skipped or warning:', error);
  }

  // 2. Provision Demo Client User (for testing standard USER role)
  const demoEmail = 'client@vestra.ai';
  const existingDemo = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingDemo) {
    const demoPasswordHash = await hashPassword('ClientPassword2026!');
    const demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        fullName: 'Elena Vance',
        passwordHash: demoPasswordHash,
        role: Role.USER,
      },
    });
    console.log(
      `✔ Demo client user created: ${demoUser.email} (${demoUser.role})`
    );
  } else {
    console.log(`ℹ Demo client user already exists: ${demoEmail}`);
  }

  console.log('✨ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
