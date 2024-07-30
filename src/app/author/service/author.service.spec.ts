import { BasePaginatedResponse, BaseResponse } from '@common/base/base';
import { provideDatabaseContext } from '@data/database/__mock__/database.mock';
import { DatabaseService } from '@data/database/service/database.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MockAuthorRepositoryContext,
  provideAuthorRepositoryContext,
} from '../__mock__/author.repository.mock';
import { AuthorQueryDto } from '../dto/author-query.dto';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { AuthorRepository } from '../repository/author.repository';
import { AuthorService } from './author.service';

describe('AuthorService', () => {
  let service: AuthorService;
  let mockRepository: MockAuthorRepositoryContext;

  beforeEach(async () => {
    mockRepository = provideAuthorRepositoryContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: AuthorRepository,
          useValue: mockRepository.repository,
        },
        {
          provide: DatabaseService,
          useValue: provideDatabaseContext().database,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author and return the created author', async () => {
      // Arrange
      const createAuthorDto = {
        name: 'New Author',
        country: 'Test Country',
        bio: 'Test Bio',
        birthday: new Date(),
      };

      const createdAuthor = {
        id: 'new-author-id',
        ...createAuthorDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult: BaseResponse<unknown> = {
        status: 'Success',
        statusCode: 201,
        message: ['Author created'],
        data: createdAuthor,
      };

      mockRepository.repository.create.mockResolvedValue(createdAuthor);

      // Act
      const result = await service.create(createAuthorDto);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs while creating the author', async () => {
      // Arrange
      const createAuthorDto: CreateAuthorDto = {
        name: 'New Author',
        country: 'Test Country',
        bio: 'Test Bio',
        birthday: new Date(),
      };

      const error = new Error('Database error');
      mockRepository.repository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createAuthorDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of authors', async () => {
      // Arrange
      const query: AuthorQueryDto = {
        name: 'Test Author',
        page: 1,
        size: 10,
      };

      const data = [
        {
          id: 'test-id',
          name: 'Test Author',
          birthday: new Date(),
          country: 'Test Country',
          bio: 'Test Bio',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const paginationData = {
        page: 1,
        limit: 1,
        data: data,
        totalItems: 1,
      };

      const expectedResult: BasePaginatedResponse<unknown> = {
        status: 'Success',
        statusCode: 200,
        message: ['Authors found'],
        pagination: {
          page: 1,
          pageSize: 1,
          totalItems: 1,
          totalPages: 1,
        },
        data: data,
      };

      mockRepository.repository.selectMany.mockResolvedValue(paginationData);

      // Act
      const result = await service.findAll(query);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs while retrieving the authors', async () => {
      // Arrange
      const query: AuthorQueryDto = {
        name: 'Test Author',
        page: 1,
        size: 10,
      };

      const error = new Error('Database error');
      mockRepository.repository.selectMany.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findAll(query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a found author', async () => {
      // Arrange
      const authorId = 'test-id';

      const authorData = {
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      const expectedResult: BaseResponse<unknown> = {
        status: 'Success',
        statusCode: 200,
        message: ['Author found'],
        data: authorData,
      };

      mockRepository.repository.selectOne.mockResolvedValue(authorData);

      // Act
      const result = await service.findOne(authorId);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw InternalServerErrorException if an error occurs while retrieving the author', async () => {
      // Arrange
      const authorId = 'test-id';
      const error = new Error('Database error');
      mockRepository.repository.selectOne.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findOne(authorId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw NotFoundException if the author is not found', async () => {
      // Arrange
      const authorId = 'test-id';
      mockRepository.repository.selectOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(authorId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an author and return the updated author', async () => {
      // Arrange
      const authorId = 'test-id';
      const updateDto: UpdateAuthorDto = {
        name: 'Updated Author',
        country: 'Updated Country',
        birthday: new Date(),
        bio: 'Updated Bio',
      };

      const prevAuthorData = {
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      const updatedAuthorData = {
        ...prevAuthorData,
        ...updateDto,
        updatedAt: new Date(),
      };

      const expectedResult: BaseResponse<unknown> = {
        status: 'Success',
        statusCode: 200,
        message: ['Author updated'],
        data: updatedAuthorData,
      };

      mockRepository.repository.selectOne.mockResolvedValue(prevAuthorData);
      mockRepository.repository.update.mockResolvedValue(updatedAuthorData);

      // Act
      const result = await service.update(authorId, updateDto);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if the author is not found', async () => {
      // Arrange
      const authorId = 'non-existent-id';
      const updateDto: UpdateAuthorDto = {
        name: 'Updated Author',
        country: 'Updated Country',
        birthday: new Date(),
        bio: 'Updated Bio',
      };

      mockRepository.repository.selectOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(authorId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if an error occurs while updating the author', async () => {
      // Arrange
      const authorId = 'test-id';
      const updateDto: UpdateAuthorDto = {
        name: 'Updated Author',
        country: 'Updated Country',
        birthday: new Date(),
        bio: 'Updated Bio',
      };

      const prevAuthorData = {
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      const error = new Error('Database error');

      mockRepository.repository.selectOne.mockResolvedValue(prevAuthorData);
      mockRepository.repository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.update(authorId, updateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an author successfully', async () => {
      // Arrange
      const authorId = 'test-id';
      const query = { includeBooks: true };
      const authorData = {
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      mockRepository.repository.selectOne.mockResolvedValue(authorData);
      mockRepository.repository.delete.mockResolvedValue(undefined);

      const expectedResult: BaseResponse<void> = {
        status: 'Success',
        statusCode: 200,
        message: ['Author deleted'],
      };

      // Act
      const result = await service.delete(authorId, query);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if the author is not found', async () => {
      // Arrange
      const authorId = 'test-id';
      const query = { includeBooks: true };

      mockRepository.repository.selectOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.delete(authorId, query)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if an error occurs while selecting the author', async () => {
      // Arrange
      const authorId = 'test-id';
      const query = { includeBooks: true };
      const error = new Error('Database error');

      mockRepository.repository.selectOne.mockRejectedValue(error);

      // Act & Assert
      await expect(service.delete(authorId, query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if an error occurs while deleting the author', async () => {
      // Arrange
      const authorId = 'test-id';
      const query = { includeBooks: true };
      const authorData = {
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };
      const error = new Error('Database error');

      mockRepository.repository.selectOne.mockResolvedValue(authorData);
      mockRepository.repository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.delete(authorId, query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
