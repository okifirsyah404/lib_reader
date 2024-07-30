import { appConfig } from '@/config/app.config';
import { PagingDatabase } from '@data/database/interface/database.interface';
import { DatabaseService } from '@data/database/service/database.service';
import PrismaSelector from '@data/selector/prisma-selector';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Retrieves multiple books from the database.
   * @returns A promise that resolves to an array of books.
   */
  async selectMany(options?: {
    title?: string;
    page?: number;
    limit?: number;
  }): Promise<PagingDatabase<any>> {
    const skip = options?.page
      ? (options.page - 1) * (options.limit || appConfig.pagination.pageSize)
      : undefined;

    const total = await this.count();

    const take = options?.limit
      ? options.limit
      : total < appConfig.pagination.pageSize
        ? total
        : appConfig.pagination.pageSize;

    const data = await this.database.book.findMany({
      where: {
        title: options?.title ? { contains: options.title } : undefined,
      },
      skip: skip,
      take: take,
      select: {
        ...PrismaSelector.book,
        authors: {
          select: PrismaSelector.author,
        },
      },
    });

    return {
      page: options?.page || 1,
      limit: take,
      data: data,
      totalItems: total,
    };
  }

  /**
   * Retrieves a single book from the database based on the provided ID.
   * @param id - The ID of the book to retrieve.
   * @returns A Promise that resolves to the retrieved book.
   */
  async selectOne(id: string) {
    return this.database.book.findUnique({
      where: { id },
      select: {
        ...PrismaSelector.book,
        authors: {
          select: PrismaSelector.author,
        },
      },
    });
  }

  /**
   * Creates a new book in the database.
   * @param data - The data for the new book.
   * @returns A promise that resolves to the created book.
   */
  async create(data: {
    authorId: string;
    title: string;
    isbn: string;
    language: string;
    pages: number;
    publisher: string;
    published: Date;
    genres: string[] | string;
    coverUrl?: string;
    description?: string;
  }) {
    return this.database.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        language: data.language,
        pages: data.pages,
        publisher: data.publisher,
        published: data.published,
        coverUrl: data.coverUrl,
        genres: Array.isArray(data.genres) ? data.genres : [data.genres],
        description: data.description,
        authors: {
          connect: {
            id: data.authorId,
          },
        },
      },
      select: {
        ...PrismaSelector.book,
        authors: {
          select: PrismaSelector.author,
        },
      },
    });
  }

  /**
   * Updates a book in the database.
   *
   * @param id - The ID of the book to update.
   * @param data - The updated book data.
   * @returns A promise that resolves to the updated book.
   */
  async update(
    id: string,
    data: {
      authorId?: string;
      title?: string;
      isbn?: string;
      language?: string;
      pages?: number;
      publisher?: string;
      published?: Date;
      coverUrl?: string;
      genres?: string[] | string;
      description?: string;
    },
  ) {
    return this.database.book.update({
      where: { id },
      data: {
        title: data.title,
        isbn: data.isbn,
        coverUrl: data.coverUrl,
        published: data.published,
        publisher: data.publisher,
        pages: data.pages,
        language: data.language,
        genres: data.genres
          ? Array.isArray(data.genres)
            ? data.genres
            : [data.genres]
          : [],
        description: data.description,
        authorId: data.authorId,
      },
      select: {
        ...PrismaSelector.book,
        authors: {
          select: PrismaSelector.author,
        },
      },
    });
  }

  /**
   * Deletes a book from the database.
   * @param id - The ID of the book to delete.
   */
  async delete(id: string) {
    await this.database.book.delete({
      where: { id },
    });
  }

  /**
   * Counts the number of books in the database.
   * @returns A Promise that resolves to the number of books.
   */
  async count() {
    return this.database.book.count();
  }
}
