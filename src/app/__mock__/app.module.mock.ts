import { AppController } from '@app/app.controller';
import { AuthModule } from '@app/auth/auth.module';
import { AuthorModule } from '@app/author/author.module';
import { BookModule } from '@app/book/book.module';
import { DatabaseModule } from '@data/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRootAsync({}),
    AuthorModule,
    BookModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppMockModule {}
