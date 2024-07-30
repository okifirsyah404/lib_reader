import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class BookDto {
  constructor(
    title: string,
    language: string,
    genres: string[],
    isbn: string,
    publisher: string,
    published: Date,
    pages: number,
    authorId: string,
    coverUrl?: string,
    description?: string,
  ) {
    this.title = title;
    this.language = language;
    this.genres = genres;
    this.isbn = isbn;
    this.publisher = publisher;
    this.published = published;
    this.pages = pages;
    this.authorId = authorId;
    this.coverUrl = coverUrl;
    this.description = description;
  }

  @ApiProperty({
    example: 'Electronic Concrete Keyboard',
    description: "The book's title.",
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: 'EN',
    description: "The book's language.",
  })
  @IsString()
  @IsNotEmpty()
  readonly language: string;

  @ApiProperty({
    example: ['Fiction'],
    description: "The book's genres.",
  })
  @IsArray()
  @IsNotEmpty()
  readonly genres: string[];

  @ApiProperty({
    example: '978-3-16-148410-0',
    description: "The book's ISBN.",
  })
  @IsString()
  @IsNotEmpty()
  readonly isbn: string;

  @ApiProperty({
    example: 'Publisher',
    description: "The book's publisher.",
  })
  @IsString()
  @IsNotEmpty()
  readonly publisher: string;

  @Type(() => Date)
  @ApiProperty({
    example: '2024-07-27T02:10:32.350Z',
    description: "The book's publication date.",
  })
  @IsDate()
  @IsNotEmpty()
  readonly published: Date;

  @ApiProperty({
    example: 'clz3hv4tb0002xugjserptow0',
    description: "The book's author ID.",
  })
  @IsString()
  @IsNotEmpty()
  readonly authorId: string;

  @ApiProperty({
    example: 247,
    description: "The book's number of pages.",
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly pages: number;

  @ApiPropertyOptional({
    example: 'https://picsum.photos/seed/UEnFye1xH/640/480',
    description: "The book's cover URL.",
  })
  @IsString()
  @IsOptional()
  readonly coverUrl?: string;

  @ApiPropertyOptional({
    example: 'A short description',
    description: "The book's description.",
  })
  @IsString()
  readonly description?: string;
}
