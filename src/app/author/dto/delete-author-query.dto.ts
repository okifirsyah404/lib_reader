import { AuthorDto } from '@common/dto/author.dto';
import { PickType } from '@nestjs/swagger';

export class DeleteAuthorQueryDto extends PickType(AuthorDto, [
  'includeBooks',
]) {}
