import { AuthorModule } from '@app/author/author.module';
import { Module } from '@nestjs/common';
import { BookController } from './controller/book.controller';
import { BookRepository } from './repository/book.repository';
import { BookService } from './service/book.service';

@Module({
  imports: [AuthorModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookRepository],
})
export class BookModule {}
