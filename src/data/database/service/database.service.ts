import DiKey from '@/common/res/di/di-key';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseModuleOptions } from '../interface/database.interface';

@Injectable()
export class DatabaseService
  extends PrismaClient<Prisma.PrismaClientOptions>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(DiKey.DatabaseOption)
    private readonly options?: DatabaseModuleOptions,
  ) {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
