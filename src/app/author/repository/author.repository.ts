import { appConfig } from '@/config/app.config';
import { PagingDatabase } from '@data/database/interface/database.interface';
import { DatabaseService } from '@data/database/service/database.service';
import PrismaSelector from '@data/selector/prisma-selector';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Retrieves multiple authors from the database along with their associated books.
   * @returns A promise that resolves to an array of authors with their books.
   */
  async selectMany(options?: {
    name?: string;
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

    const data = await this.database.author.findMany({
      where: {
        name: options?.name ? { contains: options.name } : undefined,
      },
      skip: skip,
      take: take,
      select: {
        ...PrismaSelector.author,
        books: {
          select: PrismaSelector.book,
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
   * Retrieves a single author from the database based on the provided ID.
   * @param id - The ID of the author to retrieve.
   * @returns A Promise that resolves to the retrieved author with associated books.
   */
  async selectOne(id: string) {
    return this.database.author.findUnique({
      where: { id },
      select: {
        ...PrismaSelector.author,
        books: {
          select: PrismaSelector.book,
        },
      },
    });
  }

  /**
   * Creates a new author record in the database.
   * @param data - The data for the new author.
   * @returns A Promise that resolves to the created author record.
   */
  async create(data: {
    name: string;
    birthday: Date;
    country: string;
    bio?: string;
  }) {
    return this.database.author.create({
      data: data,
      select: PrismaSelector.author,
    });
  }

  /**
   * Updates an author's information in the database.
   * @param id - The ID of the author to update.
   * @param data - The updated data for the author.
   * @returns A promise that resolves to the updated author.
   */
  async update(
    id: string,
    data: {
      name?: string;
      birthday?: Date;
      country?: string;
      bio?: string;
    },
  ) {
    return this.database.author.update({
      where: { id },
      data: data,
      select: PrismaSelector.author,
    });
  }

  /**
   * Deletes an author from the database.
   * @param id - The ID of the author to delete.
   * @returns A promise that resolves to the deleted author.
   */
  async delete(id: string, options?: { withBooks?: boolean }) {
    await this.database.author.delete({
      where: { id },
      include: {
        books: options?.withBooks,
      },
    });
  }

  /**
   * Retrieves the total number of authors in the database.
   * @returns A promise that resolves to the total number of authors.
   */
  async count() {
    return this.database.author.count();
  }
}
