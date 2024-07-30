import {
  MockAuthorRepositoryContext,
  provideAuthorRepositoryContext,
} from '@app/author/__mock__/author.repository.mock';
import { AuthorRepository } from '@app/author/repository/author.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MockBookRepositoryContext,
  provideBookRepositoryContext,
} from '../__mock__/book.repository.mock';
import { BookRepository } from '../repository/book.repository';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let authorRepositoryContext: MockAuthorRepositoryContext;
  let bookRepositoryContext: MockBookRepositoryContext;

  beforeEach(async () => {
    authorRepositoryContext = provideAuthorRepositoryContext();
    bookRepositoryContext = provideBookRepositoryContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookRepository,
          useValue: bookRepositoryContext.repository,
        },
        {
          provide: AuthorRepository,
          useValue: authorRepositoryContext.repository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const createAuthorDto = {
    name: 'New Author',
    country: 'Test Country',
    bio: 'Test Bio',
    birthday: new Date(),
  };

  const author = {
    id: 'author-id',
    ...createAuthorDto,
    books: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const book = {
    title: 'Test Book',
    description: 'Test Description',
    isbn: '1234567890',
    genres: ['Fiction'],
    coverUrl: 'http://example.com/cover.jpg',
    language: 'English',
    pages: 300,
    published: new Date(),
    publisher: 'Test Publisher',
  };

  const bookWithAuthors = {
    ...book,
    authors: {
      id: author.id,
      name: author.name,
      country: author.country,
      bio: author.bio,
      birthday: author.birthday,
    },
  };

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createdBook = { id: 'book-id', ...bookWithAuthors };

      authorRepositoryContext.repository.selectOne.mockResolvedValue(author);
      bookRepositoryContext.repository.create.mockResolvedValue(createdBook);

      const result = await service.create({
        authorId: author.id,
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        genres: book.genres,
        coverUrl: book.coverUrl,
        language: book.language,
        pages: book.pages,
        published: book.published,
        publisher: book.publisher,
      });

      expect(result).toEqual({
        status: 'Success',
        statusCode: 201,
        message: ['Book created'],
        data: createdBook,
      });
    });

    it('should throw NotFoundException if author is not found', async () => {
      const createBookDto = {
        authorId: 'non-existent-author-id',
        title: 'Test Book',
        description: 'Test Description',
        isbn: '1234567890',
        genres: ['Fiction'],
        coverUrl: 'http://example.com/cover.jpg',
        language: 'English',
        pages: 300,
        published: new Date(),
        publisher: 'Test Publisher',
      };

      authorRepositoryContext.repository.selectOne.mockResolvedValue(null);

      await expect(service.create(createBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if there is an error while looking up the author', async () => {
      const createBookDto = {
        authorId: 'author-id',
        title: 'Test Book',
        description: 'Test Description',
        isbn: '1234567890',
        genres: ['Fiction'],
        coverUrl: 'http://example.com/cover.jpg',
        language: 'English',
        pages: 300,
        published: new Date(),
        publisher: 'Test Publisher',
      };

      authorRepositoryContext.repository.selectOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createBookDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if there is an error while creating the book', async () => {
      const createBookDto = {
        authorId: author.id,
        ...book,
      };

      authorRepositoryContext.repository.selectOne.mockResolvedValue({
        id: author.id,
        bio: author.bio,
        birthday: author.birthday,
        country: author.country,
        name: author.name,
        books: author.books,
      });

      authorRepositoryContext.repository.selectOne.mockResolvedValue({
        id: author.id,
        bio: author.bio,
        birthday: author.birthday,
        country: author.country,
        name: author.name,
        books: author.books,
      });

      bookRepositoryContext.repository.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createBookDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    const query = {
      title: 'Test Book',
      page: 1,
      size: 10,
    };

    const paginatedBooks = {
      page: 1,
      limit: 10,
      totalItems: 2,
      data: [
        {
          id: 'book-id-1',
          title: 'Test Book 1',
          description: 'Test Description 1',
          isbn: '1234567890',
          genres: ['Fiction'],
          coverUrl: 'http://example.com/cover1.jpg',
          language: 'English',
          pages: 300,
          published: new Date(),
          publisher: 'Test Publisher 1',
        },
        {
          id: 'book-id-2',
          title: 'Test Book 2',
          description: 'Test Description 2',
          isbn: '0987654321',
          genres: ['Non-Fiction'],
          coverUrl: 'http://example.com/cover2.jpg',
          language: 'English',
          pages: 200,
          published: new Date(),
          publisher: 'Test Publisher 2',
        },
      ],
    };

    it('should return a paginated list of books successfully', async () => {
      bookRepositoryContext.repository.selectMany.mockResolvedValue(
        paginatedBooks,
      );

      const result = await service.findAll(query);

      expect(result).toEqual({
        status: 'Success',
        statusCode: 200,
        message: ['Books found'],
        pagination: {
          page: paginatedBooks.page,
          pageSize: paginatedBooks.data.length,
          totalItems: paginatedBooks.totalItems,
          totalPages: Math.ceil(
            paginatedBooks.totalItems / paginatedBooks.data.length,
          ),
        },
        data: paginatedBooks.data,
      });
    });

    it('should throw InternalServerErrorException if there is an error while retrieving the books', async () => {
      bookRepositoryContext.repository.selectMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAll(query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return the book if found', async () => {
      const bookId = 'book-id';
      const foundBook = { id: bookId, ...bookWithAuthors };

      bookRepositoryContext.repository.selectOne.mockResolvedValue(foundBook);

      const result = await service.findOne(bookId);

      expect(result).toEqual({
        status: 'Success',
        statusCode: 200,
        message: ['Book found'],
        data: foundBook,
      });
    });

    it('should throw NotFoundException if the book is not found', async () => {
      const bookId = 'non-existent-book-id';

      bookRepositoryContext.repository.selectOne.mockResolvedValue(null);

      await expect(service.findOne(bookId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if there is an error during lookup', async () => {
      const bookId = 'book-id';
      const error = new Error('Database error');

      bookRepositoryContext.repository.selectOne.mockRejectedValue(error);

      await expect(service.findOne(bookId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const updateBookDto = {
      title: 'Updated Title',
      description: 'Updated Description',
      isbn: '0987654321',
      genres: ['Non-Fiction'],
      coverUrl: 'http://example.com/updated-cover.jpg',
      language: 'Spanish',
      pages: 400,
      published: new Date(),
      publisher: 'Updated Publisher',
    };

    it('should update a book successfully', async () => {
      const prevBook = { id: 'book-id', ...bookWithAuthors };
      const updatedBook = { ...prevBook, ...updateBookDto };

      bookRepositoryContext.repository.selectOne.mockResolvedValue(prevBook);
      bookRepositoryContext.repository.update.mockResolvedValue(updatedBook);

      const result = await service.update('book-id', updateBookDto);

      expect(result).toEqual({
        status: 'Success',
        statusCode: 200,
        message: ['Book updated'],
        data: updatedBook,
      });
    });

    it('should throw NotFoundException if book is not found', async () => {
      bookRepositoryContext.repository.selectOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-book-id', updateBookDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if author is not found', async () => {
      const prevBook = { id: 'book-id', ...bookWithAuthors };
      const updateBookDtoWithAuthor = {
        ...updateBookDto,
        authorId: 'non-existent-author-id',
      };

      bookRepositoryContext.repository.selectOne.mockResolvedValue(prevBook);
      authorRepositoryContext.repository.selectOne.mockResolvedValue(null);

      await expect(
        service.update('book-id', updateBookDtoWithAuthor),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if there is an error while looking up the book', async () => {
      bookRepositoryContext.repository.selectOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.update('book-id', updateBookDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if there is an error while updating the book', async () => {
      const prevBook = { id: 'book-id', ...bookWithAuthors };

      bookRepositoryContext.repository.selectOne.mockResolvedValue(prevBook);
      bookRepositoryContext.repository.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.update('book-id', updateBookDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    const bookId = 'book-id';
    const book = {
      id: bookId,
      title: 'Test Book',
      description: 'Test Description',
      isbn: '1234567890',
      genres: ['Fiction'],
      coverUrl: 'http://example.com/cover.jpg',
      language: 'English',
      pages: 300,
      published: new Date(),
      publisher: 'Test Publisher',
      authors: {
        id: 'author-id',
        name: 'Author Name',
        country: 'Author Country',
        bio: 'Author Bio',
        birthday: new Date(),
      },
    };

    it('should delete a book successfully', async () => {
      bookRepositoryContext.repository.selectOne.mockResolvedValue(book);
      bookRepositoryContext.repository.delete.mockResolvedValue(undefined);

      const result = await service.delete(bookId);

      expect(result).toEqual({
        status: 'Success',
        statusCode: 200,
        message: ['Book deleted'],
      });
    });

    it('should throw NotFoundException if book is not found', async () => {
      bookRepositoryContext.repository.selectOne.mockResolvedValue(null);

      await expect(service.delete(bookId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if there is an error while looking up the book', async () => {
      bookRepositoryContext.repository.selectOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.delete(bookId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if there is an error while deleting the book', async () => {
      bookRepositoryContext.repository.selectOne.mockResolvedValue(book);
      bookRepositoryContext.repository.delete.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.delete(bookId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
