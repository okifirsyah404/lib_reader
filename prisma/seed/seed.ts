import { PrismaClient } from '@prisma/client';
import bookSeeder from './seeder/book-seed';
import userSeeder from './seeder/user-seeder';

const prisma = new PrismaClient();

async function main() {
  await userSeeder(prisma);
  await bookSeeder(prisma);
}

main()
  .then(async () => {
    console.log('Seed data complete');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
