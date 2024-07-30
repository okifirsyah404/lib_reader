import { Module } from '@nestjs/common';
import { AuthorController } from './controller/author.controller';
import { AuthorService } from './service/author.service';
import { AuthorRepository } from './repository/author.repository';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
  exports: [AuthorRepository],
})
export class AuthorModule {}
