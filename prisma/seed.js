import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  // Check if the super admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: 'vinayak@abetworks.in'
    }
  });

  if (!existingUser) {
    // Create super admin user
    const user = await prisma.user.create({
      data: {
        email: 'vinayak@abetworks.in',
        name: 'Vinayak',
        user_id: crypto.randomUUID(),
        password: await hashPassword('Vinayak@123'), // In production, use proper password hashing
        isActive: true
      }
    });

    console.log('Created super admin user:', user.email);
  } else {
    console.log('Super admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
