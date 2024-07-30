import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { provideAuthorRepositoryContext } from '../__mock__/author.repository.mock';
import {
  MockAuthorServiceContext,
  provideAuthorServiceContext,
} from '../__mock__/author.service.mock';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { DeleteAuthorQueryDto } from '../dto/delete-author-query.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { AuthorRepository } from '../repository/author.repository';
import { AuthorService } from '../service/author.service';
import { AuthorController } from './author.controller';

describe('AuthorController', () => {
  let controller: AuthorController;
  let mockAuthorServiceContext: MockAuthorServiceContext;

  beforeEach(async () => {
    mockAuthorServiceContext = provideAuthorServiceContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorRepository,
          useValue: provideAuthorRepositoryContext,
        },
        {
          provide: AuthorService,
          useValue: mockAuthorServiceContext.service,
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createAuthorDto: CreateAuthorDto = {
      name: 'John Doe',
      country: 'USA',
      birthday: new Date('1990-01-01'),
      bio: 'An accomplished author',
    };

    const result = {
      status: 'success',
      statusCode: 201,
      message: ['Author created'],
      data: {
        id: '1',
        ...createAuthorDto,
      },
    };

    it('should create a new author successfully', async () => {
      mockAuthorServiceContext.service.create.mockResolvedValue(result);

      expect(await controller.create(createAuthorDto)).toEqual(result);
    });

    it('should return validation error when input is invalid', async () => {
      mockAuthorServiceContext.service.create.mockRejectedValue(
        new BadRequestException('Name must be string'),
      );

      const result = controller.create(createAuthorDto);

      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return an error when user is not authorized', async () => {
      mockAuthorServiceContext.service.create.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      const result = controller.create(createAuthorDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return an error when author creation fails', async () => {
      mockAuthorServiceContext.service.create.mockRejectedValue(
        new InternalServerErrorException('Author creation failed'),
      );

      const result = controller.create(createAuthorDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    const queryDto = {
      name: 'John',
      page: 1,
      limit: 10,
    };

    const result = {
      status: 'success',
      statusCode: 200,
      message: ['Authors retrieved'],
      pagination: {
        page: 1,
        pageSize: 1,
        totalItems: 1,
        totalPages: 1,
      },
      data: [
        {
          id: '1',
          name: 'John Doe',
          country: 'USA',
          birthday: new Date('1990-01-01'),
          bio: 'An accomplished author',
        },
      ],
    };

    it('should retrieve a list of authors successfully', async () => {
      mockAuthorServiceContext.service.findAll.mockResolvedValue(result);

      expect(await controller.findAll(queryDto)).toEqual(result);
    });

    it('should return validation error when input is invalid', async () => {
      mockAuthorServiceContext.service.findAll.mockRejectedValue(
        new BadRequestException('Invalid query parameters'),
      );

      const result = controller.findAll(queryDto);

      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return an error when user is not authorized', async () => {
      mockAuthorServiceContext.service.findAll.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      const result = controller.findAll(queryDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return an error when fetching authors fails', async () => {
      mockAuthorServiceContext.service.findAll.mockRejectedValue(
        new InternalServerErrorException('Fetching authors failed'),
      );

      const result = controller.findAll(queryDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    const authorId = '1';
    const result = {
      status: 'success',
      statusCode: 200,
      message: ['Author retrieved'],
      data: {
        id: authorId,
        name: 'John Doe',
        country: 'USA',
        birthday: new Date('1990-01-01'),
        bio: 'An accomplished author',
      },
    };

    it('should retrieve an author successfully', async () => {
      mockAuthorServiceContext.service.findOne.mockResolvedValue(result);

      expect(await controller.findOne(authorId)).toEqual(result);
    });

    it('should return not found error when author does not exist', async () => {
      mockAuthorServiceContext.service.findOne.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      const result = controller.findOne(authorId);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should return an error when user is not authorized', async () => {
      mockAuthorServiceContext.service.findOne.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      const result = controller.findOne(authorId);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return an error when fetching author fails', async () => {
      mockAuthorServiceContext.service.findOne.mockRejectedValue(
        new InternalServerErrorException('Fetching author failed'),
      );

      const result = controller.findOne(authorId);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const updateAuthorDto: UpdateAuthorDto = {
      name: 'Jane Doe',
      country: 'Canada',
      birthday: new Date('1985-05-15'),
      bio: 'A renowned author',
    };

    const result = {
      status: 'success',
      statusCode: 200,
      message: ['Author updated'],
      data: {
        id: '1',
        ...updateAuthorDto,
      },
    };

    it('should update an author successfully', async () => {
      mockAuthorServiceContext.service.update.mockResolvedValue(result);

      expect(await controller.update('1', updateAuthorDto)).toEqual(result);
    });

    it('should return validation error when input is invalid', async () => {
      mockAuthorServiceContext.service.update.mockRejectedValue(
        new BadRequestException('Name must be string'),
      );

      const result = controller.update('1', updateAuthorDto);

      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return an error when user is not authorized', async () => {
      mockAuthorServiceContext.service.update.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      const result = controller.update('1', updateAuthorDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return an error when author is not found', async () => {
      mockAuthorServiceContext.service.update.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      const result = controller.update('1', updateAuthorDto);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should return an error when author update fails', async () => {
      mockAuthorServiceContext.service.update.mockRejectedValue(
        new InternalServerErrorException('Author update failed'),
      );

      const result = controller.update('1', updateAuthorDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    const id = '1';
    const queryDto: DeleteAuthorQueryDto = {
      includeBooks: false,
    };

    const result = {
      status: 'success',
      statusCode: 200,
      message: ['Author deleted'],
    };

    it('should delete an author successfully', async () => {
      mockAuthorServiceContext.service.delete.mockResolvedValue(result);

      expect(await controller.remove(id, queryDto)).toEqual(result);
    });

    it('should return validation error when input is invalid', async () => {
      mockAuthorServiceContext.service.delete.mockRejectedValue(
        new BadRequestException('Invalid ID format'),
      );

      const result = controller.remove(id, queryDto);

      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return an error when user is not authorized', async () => {
      mockAuthorServiceContext.service.delete.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      const result = controller.remove(id, queryDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return an error when author is not found', async () => {
      mockAuthorServiceContext.service.delete.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      const result = controller.remove(id, queryDto);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should return an error when author deletion fails', async () => {
      mockAuthorServiceContext.service.delete.mockRejectedValue(
        new InternalServerErrorException('Author deletion failed'),
      );

      const result = controller.remove(id, queryDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });
});
