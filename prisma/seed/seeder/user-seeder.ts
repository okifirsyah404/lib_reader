import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export default async function userSeeder(prisma: PrismaClient) {
  try {
    const user: Prisma.UserCreateInput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await bcrypt.hash(
        'johndoe@example.com',
        Number.parseInt(process.env.SALT_ROUNDS || '10'),
      ),
    };

    await prisma.user.create({
      data: user,
    });

    console.log('----- User seeded -----');
  } catch (error) {
    console.log('----- Error seeding user -----');
    console.error(error);
    throw new Error('Error seeding user');
  }
}
