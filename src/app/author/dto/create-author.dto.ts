import { AuthorDto } from '@common/dto/author.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateAuthorDto extends OmitType(AuthorDto, ['includeBooks']) {}
