import { Prisma } from '@prisma/client';

export default abstract class PrismaSelector {
  static user = {
    id: true,
    email: true,
    name: true,
  } satisfies Prisma.UserSelect;

  static author = {
    id: true,
    name: true,
    birthday: true,
    bio: true,
    country: true,
  } satisfies Prisma.AuthorSelect;

  static book = {
    id: true,
    title: true,
    isbn: true,
    coverUrl: true,
    published: true,
    publisher: true,
    pages: true,
    language: true,
    genres: true,
    description: true,
  } satisfies Prisma.BookSelect;
}
