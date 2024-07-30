import { BasePaginatedResponse, BaseResponse } from '@/common/base/base';
import { AuthorRepository } from '@app/author/repository/author.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BookQueryDto } from '../dto/book-query.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookRepository } from '../repository/book.repository';

@Injectable()
export class BookService {
  constructor(
    private readonly repository: BookRepository,
    private readonly authorRepository: AuthorRepository,
  ) {}

  /**
   * Creates a new book.
   * @param dto - The data for creating the book.
   * @returns A promise that resolves to a `BaseResponse` containing the created book.
   * @throws `InternalServerErrorException` if there is an error while creating the book.
   * @throws `NotFoundException` if the author specified in the createBookDto is not found.
   */
  async create(dto: CreateBookDto): Promise<BaseResponse<unknown>> {
    const author = await this.authorRepository
      .selectOne(dto.authorId)
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const result = await this.repository
      .create({
        authorId: author.id,
        title: dto.title,
        description: dto.description,
        isbn: dto.isbn,
        genres: dto.genres,
        coverUrl: dto.coverUrl,
        language: dto.language,
        pages: dto.pages,
        published: dto.published,
        publisher: dto.publisher,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 201,
      message: ['Book created'],
      data: result,
    };
  }

  /**
   * Retrieves a paginated list of books based on the provided query parameters.
   * @param query - The query parameters for filtering and pagination.
   * @returns A promise that resolves to a paginated response containing the list of books.
   * @throws `InternalServerErrorException` if there is an error while retrieving the books.
   */
  async findAll(query: BookQueryDto): Promise<BasePaginatedResponse<unknown>> {
    const result = await this.repository
      .selectMany({
        title: query.title,
        page: query.page,
        limit: query.size,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Books found'],
      pagination: {
        page: result.page,
        pageSize: result.data.length,
        totalItems: result.totalItems,
        totalPages: Math.ceil(result.totalItems / result.data.length),
      },
      data: result.data,
    };
  }

  /**
   * Finds a book by its ID.
   * @param id - The ID of the book to find.
   * @returns A Promise that resolves to a `BaseResponse` containing the found book.
   * @throws `InternalServerErrorException` if there is an error while retrieving the book.
   * @throws `NotFoundException` if the book is not found.
   */
  async findOne(id: string): Promise<BaseResponse<unknown>> {
    const result = await this.repository.selectOne(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (!result) {
      throw new NotFoundException('Book not found');
    }

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Book found'],
      data: result,
    };
  }

  /**
   * Updates a book with the specified ID.
   * If the author ID is provided in the updateBookDto, it will update the author as well.
   *
   * @param id - The ID of the book to update.
   * @param dto - The data to update the book with.
   * @returns A Promise that resolves to a `BaseResponse` containing the updated book data.
   * @throws `InternalServerErrorException` if there is an error while updating the book.
   * @throws `NotFoundException` if the book or author is not found.
   */
  async update(id: string, dto: UpdateBookDto): Promise<BaseResponse<unknown>> {
    const prevBook = await this.repository.selectOne(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (!prevBook) {
      throw new NotFoundException('Book not found');
    }

    let authorId = prevBook.authors?.id;

    if (dto.authorId) {
      const newAuthor = await this.authorRepository
        .selectOne(dto.authorId)
        .catch((error) => {
          throw new InternalServerErrorException(error);
        });

      if (!newAuthor) {
        throw new NotFoundException('Author not found');
      }

      authorId = newAuthor.id;
    }

    const result = await this.repository
      .update(id, {
        authorId,
        title: dto.title,
        description: dto.description,
        isbn: dto.isbn,
        genres: dto.genres,
        coverUrl: dto.coverUrl,
        language: dto.language,
        pages: dto.pages,
        published: dto.published,
        publisher: dto.publisher,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Book updated'],
      data: result,
    };
  }

  /**
   * Deletes a book with the specified ID.
   *
   * @param id - The ID of the book to delete.
   * @returns A promise that resolves to a void `BaseResponse` indicating the status of the operation.
   * @throws `InternalServerErrorException` if there is an error while deleting the book.
   * @throws `NotFoundException` if the book with the specified ID is not found.
   */
  async delete(id: string): Promise<BaseResponse<void>> {
    const book = await this.repository.selectOne(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.repository.delete(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Book deleted'],
    };
  }
}
