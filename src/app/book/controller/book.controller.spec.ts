import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { provideBookRepositoryContext } from '../__mock__/book.repository.mock';
import {
  MockBookServiceContext,
  provideBookServiceContext,
} from '../__mock__/book.service.mock';
import { BookQueryDto } from '../dto/book-query.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookRepository } from '../repository/book.repository';
import { BookService } from '../service/book.service';
import { BookController } from './book.controller';

describe('BookController', () => {
  let controller: BookController;
  let mockBookServiceContext: MockBookServiceContext;

  beforeEach(async () => {
    mockBookServiceContext = provideBookServiceContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookServiceContext.service,
        },
        {
          provide: BookRepository,
          useValue: provideBookRepositoryContext().repository,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const bookDto: CreateBookDto = {
      title: 'Test Book',
      isbn: '1234567890',
      language: 'English',
      genres: ['Fiction'],
      publisher: 'Test Publisher',
      published: new Date(),
      pages: 100,
      authorId: 'author123',
      coverUrl: 'http://example.com/cover.jpg',
      description: 'Test Description',
    };

    const bookResponse = {
      status: 'Success',
      statusCode: 201,
      message: ['Book created'],
      data: {
        id: 'book123',
        ...bookDto,
      },
    };

    it('should call bookService.create with correct parameters', async () => {
      await controller.create(bookDto);

      expect(mockBookServiceContext.service.create).toHaveBeenCalledWith(
        bookDto,
      );
    });

    it('should return the created book object on success', async () => {
      mockBookServiceContext.service.create.mockResolvedValue(bookResponse);

      const result = await controller.create(bookDto);

      expect(result).toEqual(bookResponse);
    });

    it('should throw an error if author is not found', async () => {
      mockBookServiceContext.service.create.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      const result = controller.create(bookDto);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if an user not authenticated', async () => {
      mockBookServiceContext.service.create.mockRejectedValue(
        new UnauthorizedException('User not authenticated'),
      );

      const result = controller.create(bookDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if an internal server error occurs', async () => {
      mockBookServiceContext.service.create.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );

      const result = controller.create(bookDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    const bookQueryDto: BookQueryDto = {
      title: 'Test Book',
      page: 1,
      size: 10,
    };

    const bookResponse = {
      status: 'Success',
      statusCode: 200,
      message: ['Books retrieved'],
      pagination: {
        page: 1,
        pageSize: 1,
        totalItems: 1,
        totalPages: 1,
      },
      data: [
        {
          id: 'book123',
          title: 'Test Book',
          isbn: '1234567890',
          language: 'English',
          genres: ['Fiction'],
          publisher: 'Test Publisher',
          published: new Date(),
          pages: 100,
          author: {
            id: 'author123',
            name: 'Test Author',
            bio: 'Test Bio',
            country: 'Test Country',
          },
          coverUrl: 'http://example.com/cover.jpg',
          description: 'Test Description',
        },
      ],
    };

    it('should call bookService.findAll with correct parameters', async () => {
      await controller.findAll(bookQueryDto);

      expect(mockBookServiceContext.service.findAll).toHaveBeenCalledWith(
        bookQueryDto,
      );
    });

    it('should return the list of books on success', async () => {
      mockBookServiceContext.service.findAll.mockResolvedValue(bookResponse);

      const result = await controller.findAll(bookQueryDto);

      expect(result).toEqual(bookResponse);
    });

    it('should throw an error if an internal server error occurs', async () => {
      mockBookServiceContext.service.findAll.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );

      const result = controller.findAll(bookQueryDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error if an user not authenticated', async () => {
      mockBookServiceContext.service.findAll.mockRejectedValue(
        new UnauthorizedException('User not authenticated'),
      );

      const result = controller.findAll(bookQueryDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    const bookId = 'book123';
    const bookResponse = {
      status: 'Success',
      statusCode: 200,
      message: ['Book retrieved'],
      data: {
        id: bookId,
        title: 'Test Book',
        isbn: '1234567890',
        language: 'English',
        genres: ['Fiction'],
        publisher: 'Test Publisher',
        published: new Date(),
        pages: 100,
        authorId: 'author123',
        coverUrl: 'http://example.com/cover.jpg',
        description: 'Test Description',
      },
    };

    it('should call bookService.findOne with correct parameters', async () => {
      await controller.findOne(bookId);

      expect(mockBookServiceContext.service.findOne).toHaveBeenCalledWith(
        bookId,
      );
    });

    it('should return the book object on success', async () => {
      mockBookServiceContext.service.findOne.mockResolvedValue(bookResponse);

      const result = await controller.findOne(bookId);

      expect(result).toEqual(bookResponse);
    });

    it('should throw an error if book is not found', async () => {
      mockBookServiceContext.service.findOne.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      const result = controller.findOne(bookId);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if an user not authenticated', async () => {
      mockBookServiceContext.service.findOne.mockRejectedValue(
        new UnauthorizedException('User not authenticated'),
      );

      const result = controller.findOne(bookId);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if an internal server error occurs', async () => {
      mockBookServiceContext.service.findOne.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );

      const result = controller.findOne(bookId);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const updateBookDto: UpdateBookDto = {
      title: 'Updated Test Book',
      isbn: '0987654321',
      language: 'Spanish',
      genres: ['Non-Fiction'],
      publisher: 'Updated Publisher',
      published: new Date(),
      pages: 200,
      authorId: 'author456',
      coverUrl: 'http://example.com/updated-cover.jpg',
      description: 'Updated Description',
    };

    const bookResponse = {
      status: 'Success',
      statusCode: 200,
      message: ['Book updated'],
      data: {
        id: 'book123',
        ...updateBookDto,
      },
    };

    it('should call bookService.update with correct parameters', async () => {
      await controller.update('book123', updateBookDto);

      expect(mockBookServiceContext.service.update).toHaveBeenCalledWith(
        'book123',
        updateBookDto,
      );
    });

    it('should return the updated book object on success', async () => {
      mockBookServiceContext.service.update.mockResolvedValue(bookResponse);

      const result = await controller.update('book123', updateBookDto);

      expect(result).toEqual(bookResponse);
    });

    it('should throw an error if book is not found', async () => {
      mockBookServiceContext.service.update.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      const result = controller.update('book123', updateBookDto);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if user is not authenticated', async () => {
      mockBookServiceContext.service.update.mockRejectedValue(
        new UnauthorizedException('User not authenticated'),
      );

      const result = controller.update('book123', updateBookDto);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if an internal server error occurs', async () => {
      mockBookServiceContext.service.update.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );

      const result = controller.update('book123', updateBookDto);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    const bookId = 'book123';

    const deleteResponse = {
      status: 'Success',
      statusCode: 200,
      message: ['Book deleted'],
    };

    it('should call bookService.delete with correct parameters', async () => {
      await controller.remove(bookId);

      expect(mockBookServiceContext.service.delete).toHaveBeenCalledWith(
        bookId,
      );
    });

    it('should return the delete response object on success', async () => {
      mockBookServiceContext.service.delete.mockResolvedValue(deleteResponse);

      const result = await controller.remove(bookId);

      expect(result).toEqual(deleteResponse);
    });

    it('should throw an error if book is not found', async () => {
      mockBookServiceContext.service.delete.mockRejectedValue(
        new NotFoundException('Book not found'),
      );

      const result = controller.remove(bookId);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if an user not authenticated', async () => {
      mockBookServiceContext.service.delete.mockRejectedValue(
        new UnauthorizedException('User not authenticated'),
      );

      const result = controller.remove(bookId);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if an internal server error occurs', async () => {
      mockBookServiceContext.service.delete.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );

      const result = controller.remove(bookId);

      await expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });
});
