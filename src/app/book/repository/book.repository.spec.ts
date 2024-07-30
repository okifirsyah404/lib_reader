import {
  MockDatabaseContext,
  provideDatabaseContext,
} from '@data/database/__mock__/database.mock';
import { DatabaseService } from '@data/database/service/database.service';
import PrismaSelector from '@data/selector/prisma-selector';
import { Test, TestingModule } from '@nestjs/testing';
import { BookRepository } from './book.repository';

describe('BookRepository', () => {
  let provider: BookRepository;
  let mockDatabaseContext: MockDatabaseContext;

  beforeEach(async () => {
    mockDatabaseContext = provideDatabaseContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseContext.database,
        },
      ],
    }).compile();

    provider = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('selectMany', () => {
    const book = {
      title: 'Intelligent Granite Table',
      isbn: '978-0-05-599543-8',
      coverUrl: 'https://picsum.photos/seed/1xSLIR/640/480',
      published: new Date(),
      publisher: 'Lind - Stokes',
      pages: 463,
      language: 'ID',
      genres: ['Fiction'],
      authorId: '1',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockBooks = [
      { id: '1', ...book },
      { id: '2', ...book, title: 'Intelligent Rubber Hat' },
    ];

    it('should retrieve multiple books with no options', async () => {
      mockDatabaseContext.database.book.findMany.mockResolvedValue(mockBooks);
      mockDatabaseContext.database.book.count.mockResolvedValue(10);

      const options = {
        page: 1,
        limit: 10,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalItems: 10,
        data: mockBooks,
      });

      expect(mockDatabaseContext.database.book.findMany).toHaveBeenCalled();
      expect(mockDatabaseContext.database.book.count).toHaveBeenCalled();
    });

    it('should retrieve multiple books with title filter', async () => {
      mockDatabaseContext.database.book.findMany.mockResolvedValue(mockBooks);
      mockDatabaseContext.database.book.count.mockResolvedValue(10);

      const options = {
        title: 'Intelligent Granite Table',
        page: 1,
        limit: 10,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalItems: 10,
        data: mockBooks,
      });

      expect(mockDatabaseContext.database.book.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: options.title },
        },
        skip: 0,
        take: 10,
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
      expect(mockDatabaseContext.database.book.count).toHaveBeenCalled();
    });

    it('should retrieve multiple books with pagination options', async () => {
      mockDatabaseContext.database.book.findMany.mockResolvedValue(mockBooks);
      mockDatabaseContext.database.book.count.mockResolvedValue(10);

      const options = {
        page: 2,
        limit: 5,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 2,
        limit: 5,
        totalItems: 10,
        data: mockBooks,
      });

      expect(mockDatabaseContext.database.book.findMany).toHaveBeenCalledWith({
        where: {
          title: undefined,
        },
        skip: 5,
        take: 5,
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
      expect(mockDatabaseContext.database.book.count).toHaveBeenCalled();
    });

    it('should retrieve multiple books with title filter and pagination options', async () => {
      mockDatabaseContext.database.book.findMany.mockResolvedValue(mockBooks);
      mockDatabaseContext.database.book.count.mockResolvedValue(10);

      const options = {
        title: 'Intelligent Granite Table',
        page: 2,
        limit: 5,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 2,
        limit: 5,
        totalItems: 10,
        data: mockBooks,
      });

      expect(mockDatabaseContext.database.book.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: options.title },
        },
        skip: 5,
        take: 5,
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
      expect(mockDatabaseContext.database.book.count).toHaveBeenCalled();
    });
  });

  describe('selectOne', () => {
    const book = {
      id: '1',
      title: 'Intelligent Granite Table',
      isbn: '978-0-05-599543-8',
      coverUrl: 'https://picsum.photos/seed/1xSLIR/640/480',
      published: new Date(),
      publisher: 'Lind - Stokes',
      pages: 463,
      language: 'ID',
      genres: ['Fiction'],
      authorId: '1',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      createdAt: new Date(),
      updatedAt: new Date(),
      authors: [{ id: '1', name: 'Author Name' }],
    };

    it('should retrieve a book by ID', async () => {
      mockDatabaseContext.database.book.findUnique.mockResolvedValue(book);

      const result = await provider.selectOne('1');

      expect(result).toEqual(book);
      expect(mockDatabaseContext.database.book.findUnique).toHaveBeenCalledWith(
        {
          where: { id: '1' },
          select: {
            ...PrismaSelector.book,
            authors: {
              select: PrismaSelector.author,
            },
          },
        },
      );
    });

    it('should return null if no book is found', async () => {
      mockDatabaseContext.database.book.findUnique.mockResolvedValue(null);

      const result = await provider.selectOne('2');

      expect(result).toBeNull();
      expect(mockDatabaseContext.database.book.findUnique).toHaveBeenCalledWith(
        {
          where: { id: '2' },
          select: {
            ...PrismaSelector.book,
            authors: {
              select: PrismaSelector.author,
            },
          },
        },
      );
    });
  });

  describe('create', () => {
    const newBookData = {
      authorId: '1',
      title: 'New Book Title',
      isbn: '978-3-16-148410-0',
      language: 'EN',
      pages: 300,
      publisher: 'New Publisher',
      published: new Date(),
      genres: ['Science Fiction'],
      coverUrl: 'https://picsum.photos/seed/newbook/640/480',
      description: 'A new book description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdBook = {
      id: '3',
      ...newBookData,
      genres: ['Science Fiction'],
      authors: [{ id: '1', name: 'Author Name' }],
    };

    it('should create a new book', async () => {
      mockDatabaseContext.database.book.create.mockResolvedValue(createdBook);

      const result = await provider.create(newBookData);

      expect(result).toEqual(createdBook);
      expect(mockDatabaseContext.database.book.create).toHaveBeenCalledWith({
        data: {
          title: newBookData.title,
          isbn: newBookData.isbn,
          language: newBookData.language,
          pages: newBookData.pages,
          publisher: newBookData.publisher,
          published: newBookData.published,
          coverUrl: newBookData.coverUrl,
          genres: newBookData.genres,
          description: newBookData.description,
          authors: {
            connect: {
              id: newBookData.authorId,
            },
          },
        },
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
    });

    it('should create a new book with multiple genres', async () => {
      const newBookDataWithMultipleGenres = {
        ...newBookData,
        genres: ['Science Fiction', 'Fantasy'],
      };

      const createdBookWithMultipleGenres = {
        ...createdBook,
        genres: ['Science Fiction', 'Fantasy'],
      };

      mockDatabaseContext.database.book.create.mockResolvedValue(
        createdBookWithMultipleGenres,
      );

      const result = await provider.create(newBookDataWithMultipleGenres);

      expect(result).toEqual(createdBookWithMultipleGenres);
      expect(mockDatabaseContext.database.book.create).toHaveBeenCalledWith({
        data: {
          title: newBookDataWithMultipleGenres.title,
          isbn: newBookDataWithMultipleGenres.isbn,
          language: newBookDataWithMultipleGenres.language,
          pages: newBookDataWithMultipleGenres.pages,
          publisher: newBookDataWithMultipleGenres.publisher,
          published: newBookDataWithMultipleGenres.published,
          coverUrl: newBookDataWithMultipleGenres.coverUrl,
          genres: newBookDataWithMultipleGenres.genres,
          description: newBookDataWithMultipleGenres.description,
          authors: {
            connect: {
              id: newBookDataWithMultipleGenres.authorId,
            },
          },
        },
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
    });

    it('should create a new book with a single genre as a string', async () => {
      const newBookDataWithSingleGenreString = {
        ...newBookData,
        genres: 'Science Fiction',
      };

      const createdBookWithSingleGenreString = {
        ...createdBook,
        genres: ['Science Fiction'],
      };

      mockDatabaseContext.database.book.create.mockResolvedValue(
        createdBookWithSingleGenreString,
      );

      const result = await provider.create(newBookDataWithSingleGenreString);

      expect(result).toEqual(createdBookWithSingleGenreString);
      expect(mockDatabaseContext.database.book.create).toHaveBeenCalledWith({
        data: {
          title: newBookDataWithSingleGenreString.title,
          isbn: newBookDataWithSingleGenreString.isbn,
          language: newBookDataWithSingleGenreString.language,
          pages: newBookDataWithSingleGenreString.pages,
          publisher: newBookDataWithSingleGenreString.publisher,
          published: newBookDataWithSingleGenreString.published,
          coverUrl: newBookDataWithSingleGenreString.coverUrl,
          genres: ['Science Fiction'],
          description: newBookDataWithSingleGenreString.description,
          authors: {
            connect: {
              id: newBookDataWithSingleGenreString.authorId,
            },
          },
        },
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
    });
  });

  describe('update', () => {
    const book = {
      id: '1',
      title: 'Intelligent Granite Table',
      isbn: '978-0-05-599543-8',
      coverUrl: 'https://picsum.photos/seed/1xSLIR/640/480',
      published: new Date(),
      publisher: 'Lind - Stokes',
      pages: 463,
      language: 'ID',
      genres: ['Fiction'],
      authorId: '1',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedBook = {
      ...book,
      title: 'Updated Title 2',
      pages: 500,
    };

    it('should update a book with given data', async () => {
      mockDatabaseContext.database.book.update.mockResolvedValue(updatedBook);

      const result = await provider.update('1', updatedBook);

      expect(result).toEqual(updatedBook);

      expect(mockDatabaseContext.database.book.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: updatedBook.title,
          isbn: book.isbn,
          coverUrl: book.coverUrl,
          published: book.published,
          publisher: book.publisher,
          pages: 500,
          language: book.language,
          genres: book.genres,
          description: book.description,
          authorId: book.authorId,
        },
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
    });

    it('should update a book with partial data', async () => {
      mockDatabaseContext.database.book.update.mockResolvedValue(updatedBook);

      const result = await provider.update('1', updatedBook);

      expect(result).toEqual(updatedBook);
      expect(mockDatabaseContext.database.book.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: updatedBook.title,
          isbn: book.isbn,
          coverUrl: book.coverUrl,
          published: book.published,
          publisher: book.publisher,
          pages: updatedBook.pages,
          language: book.language,
          genres: book.genres,
          description: book.description,
          authorId: book.authorId,
        },
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
    });

    it('should throw an error if book not found', async () => {
      mockDatabaseContext.database.book.update.mockRejectedValue(
        new Error('Book not found'),
      );

      await expect(
        provider.update('999', { title: 'Non-existent Book' }),
      ).rejects.toThrow('Book not found');
      expect(mockDatabaseContext.database.book.update).toHaveBeenCalledWith({
        where: { id: '999' },
        data: {
          title: 'Non-existent Book',
          isbn: undefined,
          coverUrl: undefined,
          published: undefined,
          publisher: undefined,
          pages: undefined,
          language: undefined,
          genres: [],
          description: undefined,
          authorId: undefined,
        },
        select: {
          ...PrismaSelector.book,
          authors: {
            select: PrismaSelector.author,
          },
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a book by ID', async () => {
      const bookId = '1';
      mockDatabaseContext.database.book.delete.mockResolvedValue({
        id: '1',
        title: 'Intelligent Granite Table',
        isbn: '978-0-05-599543-8',
        coverUrl: 'https://picsum.photos/seed/1xSLIR/640/480',
        published: new Date(),
        publisher: 'Lind - Stokes',
        pages: 463,
        language: 'ID',
        genres: ['Fiction'],
        authorId: '1',
        description:
          'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await provider.delete(bookId);

      expect(mockDatabaseContext.database.book.delete).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });

    it('should handle deletion of a non-existent book ID', async () => {
      const bookId = 'non-existent-id';
      mockDatabaseContext.database.book.delete.mockRejectedValue(
        new Error('Book not found'),
      );

      await expect(provider.delete(bookId)).rejects.toThrow('Book not found');

      expect(mockDatabaseContext.database.book.delete).toHaveBeenCalledWith({
        where: { id: bookId },
      });
    });
  });

  describe('count', () => {
    it('should return the correct number of books', async () => {
      const mockCount = 10;
      mockDatabaseContext.database.book.count.mockResolvedValue(mockCount);

      const result = await provider.count();

      expect(result).toBe(mockCount);
      expect(mockDatabaseContext.database.book.count).toHaveBeenCalled();
    });

    it('should call the count method exactly once', async () => {
      mockDatabaseContext.database.book.count.mockResolvedValue(10);

      await provider.count();

      expect(mockDatabaseContext.database.book.count).toHaveBeenCalledTimes(1);
    });
  });
});
