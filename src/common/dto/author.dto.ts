import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthorDto {
  constructor(name: string, birthday: Date, country: string, bio?: string) {
    this.name = name;
    this.birthday = birthday;
    this.country = country;
    this.bio = bio;
  }

  @ApiProperty({
    example: 'John Doe',
    description: "The author's name.",
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '2017-03-07T20:26:52.350Z',
    description: "The author's birthday.",
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly birthday: Date;

  @ApiProperty({
    example: 'ID',
    description: "The author's country.",
  })
  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @ApiPropertyOptional({
    example: 'A short bio',
    description: "The author's biography.",
  })
  @IsString()
  @IsOptional()
  readonly bio?: string;

  @Type(() => Boolean)
  @ApiPropertyOptional({
    example: true,
    description: 'Include the author books in the response.',
  })
  @IsBoolean()
  @IsOptional()
  readonly includeBooks?: boolean;
}
