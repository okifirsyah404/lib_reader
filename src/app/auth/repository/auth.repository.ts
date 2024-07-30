import { DatabaseService } from '@data/database/service/database.service';
import PrismaSelector from '@data/selector/prisma-selector';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Creates a new user in the database.
   *
   * @param data - The user data including email, name, and password.
   * @returns A Promise that resolves to the created user.
   */
  async create(data: { email: string; name: string; password: string }) {
    return this.database.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
      select: PrismaSelector.user,
    });
  }

  /**
   * Retrieves a user from the database based on the provided email.
   * @param email - The email of the user to retrieve.
   * @param options - Additional options for the query.
   * @returns A Promise that resolves to the user object.
   */
  async selectOne(email: string, options?: { password?: boolean }) {
    return this.database.user.findUnique({
      where: { email },
      select: {
        ...PrismaSelector.user,
        password: options?.password,
      },
    });
  }
}
