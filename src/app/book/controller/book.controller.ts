import {
  internalServerErrorExample,
  unauthorizedErrorExample,
} from '@docs/docs-example';
import { DocsTag } from '@docs/docs-tag';
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
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BookQueryDto } from '../dto/book-query.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookService } from '../service/book.service';

@ApiTags(DocsTag.book)
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
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  /**
   *
   * Http POST method for creating a new book.
   *
   * Body:
   * - title: string - The book title.
   * - isbn: string - The book ISBN.
   * - language: string - The book language.
   * - genres: string[] - The book genres.
   * - publisher: string - The book publisher.
   * - published: string - The book published date.
   * - pages: number - The book pages.
   * - authorId: string - The book author ID.
   * - coverUrl: string (optional) - The book cover URL.
   * - description: string (optional) - The book description.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - data: object - The book object.
   *
   */
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  /**
   * Http GET method for retrieving all books.
   *
   * Query parameters:
   * - title: string (optional) - The book title.
   * - page: number (optional) - The page number.
   * - limit: number (optional) - The number of items per page.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - pagination: object - The pagination details.
   * - data: object[] - An array of book objects.
   *
   */
  @Get()
  findAll(@Query() query: BookQueryDto) {
    return this.bookService.findAll(query);
  }

  /**
   *
   * Http GET method for retrieving a single book.
   *
   * Path parameters:
   * - id: string - The book ID.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - data: object - The book object.
   *
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  /**
   *
   * Http PUT method for updating a book.
   *
   * Path parameters:
   * - id: string - The book ID.
   *
   * Body:
   * - title: string (optional) - The book title.
   * - isbn: string (optional) - The book ISBN.
   * - language: string (optional) - The book language.
   * - genres: string[] (optional) - The book genres.
   * - publisher: string (optional) - The book publisher.
   * - published: string (optional) - The book published date.
   * - pages: number (optional) - The book pages.
   * - authorId: string (optional) - The book author ID.
   * - coverUrl: string (optional) - The book cover URL.
   * - description: string (optional) - The book description.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   * - data: object - The updated book object.
   *
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  /**
   *
   * Http DELETE method for deleting a book.
   *
   * Path parameters:
   * - id: string - The book ID.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - An array of messages.
   *
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
