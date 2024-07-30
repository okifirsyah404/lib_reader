import {
  MockDatabaseContext,
  provideDatabaseContext,
} from '@data/database/__mock__/database.mock';
import { DatabaseService } from '@data/database/service/database.service';
import PrismaSelector from '@data/selector/prisma-selector';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';

describe('AuthRepository', () => {
  let provider: AuthRepository;
  let mockDatabaseContext: MockDatabaseContext;

  beforeEach(async () => {
    mockDatabaseContext = provideDatabaseContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseContext.database,
        },
      ],
    }).compile();

    provider = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('create', () => {
    const user = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password',
    };

    const completeUser = {
      ...user,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user', async () => {
      mockDatabaseContext.database.user.create.mockResolvedValue(completeUser);

      const result = await provider.create(user);

      expect(result).toEqual(completeUser);
      expect(mockDatabaseContext.database.user.create).toHaveBeenCalledWith({
        data: {
          email: user.email,
          name: user.name,
          password: user.password,
        },
        select: PrismaSelector.user,
      });
    });

    it('should throw an error if user creation fails', async () => {
      mockDatabaseContext.database.user.create.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(provider.create(user)).rejects.toThrow('Creation failed');
      expect(mockDatabaseContext.database.user.create).toHaveBeenCalledWith({
        data: {
          email: user.email,
          name: user.name,
          password: user.password,
        },
        select: PrismaSelector.user,
      });
    });
  });

  describe('selectOne', () => {
    const user = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password',
    };

    const completeUser = {
      ...user,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should retrieve a user by email', async () => {
      mockDatabaseContext.database.user.findUnique.mockResolvedValue(
        completeUser,
      );

      const result = await provider.selectOne(user.email);

      expect(result).toEqual(expect.objectContaining(user));
      expect(mockDatabaseContext.database.user.findUnique).toHaveBeenCalledWith(
        {
          where: { email: user.email },
          select: {
            ...PrismaSelector.user,
            password: undefined,
          },
        },
      );
    });

    it('should retrieve a user by email with password', async () => {
      mockDatabaseContext.database.user.findUnique.mockResolvedValue(
        completeUser,
      );

      const result = await provider.selectOne(user.email, { password: true });

      expect(result).toEqual(expect.objectContaining(user));
      expect(mockDatabaseContext.database.user.findUnique).toHaveBeenCalledWith(
        {
          where: { email: user.email },
          select: {
            ...PrismaSelector.user,
            password: true,
          },
        },
      );
    });

    it('should return null if user is not found', async () => {
      mockDatabaseContext.database.user.findUnique.mockResolvedValue(null);

      const result = await provider.selectOne(user.email);

      expect(result).toBeNull();
      expect(mockDatabaseContext.database.user.findUnique).toHaveBeenCalledWith(
        {
          where: { email: user.email },
          select: {
            ...PrismaSelector.user,
            password: undefined,
          },
        },
      );
    });
  });
});
