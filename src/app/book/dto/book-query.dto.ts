import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BookQueryDto extends PartialType(PaginationDto) {
  @ApiPropertyOptional({ description: 'The book title.' })
  @IsString()
  @IsOptional()
  readonly title?: string;
}
