import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export default async function bookSeeder(prisma: PrismaClient) {
  try {
    for (let i = 0; i < 5; i++) {
      const author = await prisma.author.create({
        data: {
          name: faker.person.fullName(),
          birthday: faker.date.past({
            years: 50,
          }),
          country: faker.location.country(),
          bio: faker.person.bio(),
        },
      });

      for (let i = 0; i < 5; i++) {
        await prisma.book.create({
          data: {
            title: faker.commerce.productName(),
            isbn: faker.commerce.isbn(),
            pages: faker.number.int({
              min: 100,
              max: 500,
            }),
            published: new Date(),
            genres: ['Fiction'],
            publisher: faker.company.name(),
            language: faker.location.countryCode(),
            coverUrl: faker.image.url(),
            description: faker.commerce.productDescription(),
            authors: {
              connect: {
                id: author.id,
              },
            },
          },
        });

        console.log('----- Book seeded -----');
      }

      console.log('----- Author seeded -----');
    }
  } catch (error) {
    console.error('----- Error seeding book -----');
    throw error;
  }
}
