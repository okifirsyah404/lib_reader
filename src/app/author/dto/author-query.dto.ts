import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AuthorQueryDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'The author name.' })
  @IsString()
  @IsOptional()
  readonly name?: string;
}
