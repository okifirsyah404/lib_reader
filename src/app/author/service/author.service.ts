import { BasePaginatedResponse, BaseResponse } from '@/common/base/base';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthorQueryDto } from '../dto/author-query.dto';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { DeleteAuthorQueryDto } from '../dto/delete-author-query.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { AuthorRepository } from '../repository/author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly repository: AuthorRepository) {}

  /**
   * Creates a new author.
   * @param dto - The data transfer object containing the author details.
   * @returns A promise that resolves to a `BaseResponse` object containing the created author.
   * @throws `InternalServerErrorException` if there is an error while creating the author.
   */
  async create(dto: CreateAuthorDto): Promise<BaseResponse<unknown>> {
    const result = await this.repository
      .create({
        country: dto.country,
        bio: dto.bio,
        name: dto.name,
        birthday: dto.birthday,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 201,
      message: ['Author created'],
      data: result,
    };
  }

  /**
   * Retrieves a paginated list of authors based on the provided query parameters.
   *
   * @param query - The query parameters for filtering and pagination.
   * @returns A promise that resolves to a `BasePaginatedResponse` containing the list of authors.
   * @throws `InternalServerErrorException` If an error occurs while retrieving the authors.
   */
  async findAll(
    query: AuthorQueryDto,
  ): Promise<BasePaginatedResponse<unknown>> {
    const result = await this.repository
      .selectMany({
        name: query.name,
        page: query.page,
        limit: query.size,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Authors found'],
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
   * Finds an author by their ID.
   *
   * @param id - The ID of the author to find.
   * @returns A promise that resolves to a `BaseResponse` containing the found author.
   * @throws `InternalServerErrorException` if there is an error while retrieving the author.
   * @throws `NotFoundException` if the author is not found.
   */
  async findOne(id: string): Promise<BaseResponse<unknown>> {
    const result = await this.repository.selectOne(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (!result) {
      throw new NotFoundException('Author not found');
    }

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Author found'],
      data: result,
    };
  }

  /**
   * Updates an author with the specified ID.
   * @param id - The ID of the author to update.
   * @param dto - The data transfer object containing the updated author information.
   * @returns A promise that resolves to a `BaseResponse` object containing the updated author.
   * @throws `InternalServerErrorException` if there is an error while updating the author.
   * @throws `NotFoundException` if the author with the specified ID is not found.
   */
  async update(
    id: string,
    dto: UpdateAuthorDto,
  ): Promise<BaseResponse<unknown>> {
    const prevAuthor = await this.repository.selectOne(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (!prevAuthor) {
      throw new NotFoundException('Author not found');
    }

    const result = await this.repository
      .update(id, {
        name: dto.name,
        country: dto.country,
        birthday: dto.birthday,
        bio: dto.bio,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Author updated'],
      data: result,
    };
  }

  /**
   * Deletes an author by ID.
   *
   * @param id - The ID of the author to delete.
   * @returns A promise that resolves to a `BaseResponse` object with a `void` value.
   * @throws `InternalServerErrorException` if there is an error while selecting the author.
   * @throws `NotFoundException` if the author with the specified ID is not found.
   */
  async delete(
    id: string,
    query: DeleteAuthorQueryDto,
  ): Promise<BaseResponse<void>> {
    const author = await this.repository.selectOne(id).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    await this.repository
      .delete(id, {
        withBooks: query.includeBooks,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return {
      status: 'Success',
      statusCode: 200,
      message: ['Author deleted'],
    };
  }
}
