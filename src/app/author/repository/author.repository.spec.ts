import {
  MockDatabaseContext,
  provideDatabaseContext,
} from '@data/database/__mock__/database.mock';
import { DatabaseService } from '@data/database/service/database.service';
import PrismaSelector from '@data/selector/prisma-selector';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorRepository } from './author.repository';

describe('AuthorRepository', () => {
  let provider: AuthorRepository;
  let mockDatabaseContext: MockDatabaseContext;

  beforeEach(async () => {
    mockDatabaseContext = provideDatabaseContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseContext.database,
        },
      ],
    }).compile();

    provider = module.get<AuthorRepository>(AuthorRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('create', () => {
    it('should have a create method', () => {
      expect(provider.create).toBeDefined();
    });

    it('should create a new author', async () => {
      const authorData = {
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabaseContext.database.author.create.mockResolvedValue({
        id: 'test-id',
        bio: authorData.bio,
        birthday: authorData.birthday,
        country: authorData.country,
        name: authorData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const author = await provider.create(authorData);

      expect(author).toBeDefined();
      expect(author.name).toBe('Test Author');
      expect(author.country).toBe('Test Country');
      expect(author.bio).toBe('Test Bio');
      expect(mockDatabaseContext.database.author.create).toHaveBeenCalledWith({
        data: authorData,
        select: expect.any(Object),
      });
    });
  });

  describe('selectMany', () => {
    it('should have a selectMany method', () => {
      expect(provider.selectMany).toBeDefined();
    });

    it('should return paginated authors', async () => {
      const authors = [
        {
          id: '1',
          name: 'Author 1',
          birthday: new Date(),
          country: 'Country 1',
          bio: 'Bio 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
        {
          id: '2',
          name: 'Author 2',
          birthday: new Date(),
          country: 'Country 2',
          bio: 'Bio 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
      ];

      mockDatabaseContext.database.author.count.mockResolvedValue(2);
      mockDatabaseContext.database.author.findMany.mockResolvedValue(authors);

      const options = {
        page: 1,
        limit: 10,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalItems: authors.length,
        data: authors,
      });

      expect(mockDatabaseContext.database.author.count).toHaveBeenCalled();
      expect(mockDatabaseContext.database.author.findMany).toHaveBeenCalledWith(
        {
          where: {
            name: undefined,
          },
          skip: 0,
          take: 10,
          select: {
            ...PrismaSelector.author,
            books: {
              select: PrismaSelector.book,
            },
          },
        },
      );
    });

    it('should filter authors by name', async () => {
      const authors = [
        {
          id: '1',
          name: 'Author 1',
          birthday: new Date(),
          country: 'Country 1',
          bio: 'Bio 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
        {
          id: '2',
          name: 'Author 2',
          birthday: new Date(),
          country: 'Country 2',
          bio: 'Bio 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
      ];

      mockDatabaseContext.database.author.count.mockResolvedValue(1);
      mockDatabaseContext.database.author.findMany.mockResolvedValue(authors);

      const options = {
        name: 'Author 1',
        page: 1,
        limit: 10,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalItems: 1,
        data: authors,
      });

      expect(mockDatabaseContext.database.author.count).toHaveBeenCalled();
      expect(mockDatabaseContext.database.author.findMany).toHaveBeenCalledWith(
        {
          where: {
            name: { contains: 'Author 1' },
          },
          skip: 0,
          take: 10,
          select: {
            ...PrismaSelector.author,
            books: {
              select: PrismaSelector.book,
            },
          },
        },
      );
    });

    it('should return correct pagination values when count is less than limit', async () => {
      const authors = [
        {
          id: '1',
          name: 'Author 1',
          birthday: new Date(),
          country: 'Country 1',
          bio: 'Bio 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
        {
          id: '2',
          name: 'Author 2',
          birthday: new Date(),
          country: 'Country 2',
          bio: 'Bio 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
      ];

      mockDatabaseContext.database.author.count.mockResolvedValue(
        authors.length,
      );
      mockDatabaseContext.database.author.findMany.mockResolvedValue(authors);

      const options = {
        page: 1,
        limit: authors.length,
      };

      const result = await provider.selectMany(options);

      expect(result).toEqual({
        page: 1,
        limit: authors.length,
        totalItems: authors.length,
        data: authors,
      });

      expect(mockDatabaseContext.database.author.count).toHaveBeenCalled();
      expect(mockDatabaseContext.database.author.findMany).toHaveBeenCalledWith(
        {
          where: {
            name: undefined,
          },
          skip: 0,
          take: authors.length,
          select: {
            ...PrismaSelector.author,
            books: {
              select: PrismaSelector.book,
            },
          },
        },
      );
    });
  });

  describe('selectOne', () => {
    it('should have a selectOne method', () => {
      expect(provider.selectOne).toBeDefined();
    });

    it('should return a single author', async () => {
      const author = {
        id: 'test-id',
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabaseContext.database.author.findUnique.mockResolvedValue(author);

      const result = await provider.selectOne('test-id');

      expect(result).toBeDefined();
      expect(result).toEqual(author);
      expect(
        mockDatabaseContext.database.author.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        select: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should have an update method', () => {
      expect(provider.update).toBeDefined();
    });

    it('should update an existing author', async () => {
      const authorId = 'test-id';
      const updateData = {
        name: 'Updated Author',
        birthday: new Date(),
        country: 'Updated Country',
        bio: 'Updated Bio',
      };

      const updatedAuthor = {
        id: authorId,
        name: updateData.name,
        birthday: updateData.birthday,
        country: updateData.country,
        bio: updateData.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabaseContext.database.author.update.mockResolvedValue(
        updatedAuthor,
      );

      const result = await provider.update(authorId, updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Author');
      expect(result.country).toBe('Updated Country');
      expect(result.bio).toBe('Updated Bio');
      expect(mockDatabaseContext.database.author.update).toHaveBeenCalledWith({
        where: { id: authorId },
        data: updateData,
        select: expect.any(Object),
      });
    });
  });

  describe('delete', () => {
    it('should have a delete method', () => {
      expect(provider.delete).toBeDefined();
    });

    it('should delete an author by id', async () => {
      const authorId = 'test-id';

      mockDatabaseContext.database.author.delete.mockResolvedValue({
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await provider.delete(authorId);

      expect(mockDatabaseContext.database.author.delete).toHaveBeenCalledWith({
        where: { id: authorId },
        include: {
          books: undefined,
        },
      });
    });

    it('should delete an author along with their books if withBooks option is true', async () => {
      const authorId = 'test-id';

      mockDatabaseContext.database.author.delete.mockResolvedValue({
        id: authorId,
        name: 'Test Author',
        birthday: new Date(),
        country: 'Test Country',
        bio: 'Test Bio',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await provider.delete(authorId, { withBooks: true });

      expect(mockDatabaseContext.database.author.delete).toHaveBeenCalledWith({
        where: { id: authorId },
        include: {
          books: true,
        },
      });
    });

    it('should throw an error if author does not exist', async () => {
      const authorId = 'non-existent-id';

      mockDatabaseContext.database.author.delete.mockRejectedValue(
        new Error('Author not found'),
      );

      await expect(provider.delete(authorId)).rejects.toThrow(
        'Author not found',
      );
    });
  });

  describe('count', () => {
    it('should have a count method', () => {
      expect(provider.count).toBeDefined();
    });

    it('should return the number of authors', async () => {
      mockDatabaseContext.database.author.count.mockResolvedValue(10);

      const count = await provider.count();

      expect(count).toBe(10);
      expect(mockDatabaseContext.database.author.count).toHaveBeenCalled();
    });
  });
});
