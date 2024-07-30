import { DocsTag } from '@/common/docs/docs-tag';
import {
  internalServerErrorExample,
  unauthorizedErrorExample,
} from '@docs/docs-example';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthorDocsExample } from '../docs/author-docs';
import { AuthorQueryDto } from '../dto/author-query.dto';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { DeleteAuthorQueryDto } from '../dto/delete-author-query.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { AuthorService } from '../service/author.service';

@ApiTags(DocsTag.author)
@ApiBearerAuth()
@ApiInternalServerErrorResponse({
  schema: {
    example: internalServerErrorExample,
    description: 'Internal server error',
  },
})
@ApiUnauthorizedResponse({
  example: unauthorizedErrorExample,
  description: 'Unauthorized',
})
@UseGuards(JwtAuthGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly service: AuthorService) {}

  /**
   * Http POST method for creating a new author.
   *
   * Body:
   * - name: string - The author name.
   * - country: string - The author country.
   * - birthday: string - The author birthday.
   * - bio: string (optional) - The author biography.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - data: object - The author object.
   *
   */
  @ApiCreatedResponse({
    schema: {
      example: AuthorDocsExample.create,
      description: 'The author has been successfully created.',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: AuthorDocsExample.badRequest,
      description: 'Validation error',
    },
  })
  @Post()
  async create(@Body() dto: CreateAuthorDto) {
    return this.service.create(dto);
  }

  /**
   * Http GET method for fetching all authors.
   *
   * Query parameters:
   * - name: string (optional) - The author name.
   * - page: number (optional) - The page number.
   * - limit: number (optional) - The number of items per page.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - pagination: object - The pagination details.
   * - data: object[] - An array of authors.
   *
   */
  @ApiOkResponse({
    schema: {
      example: AuthorDocsExample.findMany,
      description: 'The list of authors has been successfully retrieved.',
    },
  })
  @Get()
  async findAll(@Query() query: AuthorQueryDto) {
    return this.service.findAll(query);
  }

  /**
   * Http GET method for fetching a single author.
   *
   * Path parameters:
   * - id: string - The ID of the author to fetch.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - data: object - The author object.
   *
   */
  @ApiOkResponse({
    schema: {
      example: AuthorDocsExample.findOne,
      description: 'The author has been successfully retrieved.',
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: AuthorDocsExample.notFound,
      description: 'The author was not found.',
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Http PUT method for updating an author.
   *
   * Path parameters:
   * - id: string - The ID of the author to update.
   *
   * Body:
   * - name: string - The author name.
   * - country: string - The author country.
   * - birthday: string - The author birthday.
   * - bio: string (optional) - The author biography.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - data: object - The updated author object.
   *
   */
  @ApiOkResponse({
    schema: {
      example: AuthorDocsExample.update,
      description: 'The author has been successfully updated.',
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: AuthorDocsExample.notFound,
      description: 'The author was not found.',
    },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.service.update(id, updateAuthorDto);
  }

  /**
   * Http DELETE method for deleting an author.
   *
   * Path parameters:
   * - id: string - The ID of the author to delete.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   *
   */
  @ApiOkResponse({
    schema: {
      example: AuthorDocsExample.delete,
      description: 'The author has been successfully deleted.',
    },
  })
  @ApiNotFoundResponse({
    schema: {
      example: AuthorDocsExample.notFound,
      description: 'The author was not found.',
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Query() query: DeleteAuthorQueryDto) {
    return this.service.delete(id, query);
  }
}
