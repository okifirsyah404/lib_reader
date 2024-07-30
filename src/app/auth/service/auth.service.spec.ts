import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import {
  MockAuthRepositoryContext,
  provideAuthRepositoryContext,
} from '../__mock__/auth.repository.mock';
import { AuthRepository } from '../repository/auth.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRepositoryContext: MockAuthRepositoryContext;

  beforeEach(async () => {
    mockRepositoryContext = provideAuthRepositoryContext();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '30s',
          },
        }),
      ],
      providers: [
        AuthService,
        JwtService,
        {
          provide: AuthRepository,
          useValue: mockRepositoryContext.repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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

  describe('signIn', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'password',
    };

    it('should sign in a user successfully', async () => {
      const userWithPassword = {
        ...completeUser,
        password: await bcrypt.hash(signInDto.password, 10),
      };

      mockRepositoryContext.repository.selectOne.mockResolvedValue(
        userWithPassword,
      );
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(service['jwt'], 'signAsync').mockResolvedValue('token');

      const result = await service.signIn(signInDto);

      expect(result).toEqual({
        status: 'Success',
        statusCode: 201,
        message: ['User signed in'],
        data: {
          token: 'token',
        },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRepositoryContext.repository.selectOne.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const userWithPassword = {
        ...completeUser,
        password: await bcrypt.hash(signInDto.password, 10),
      };

      mockRepositoryContext.repository.selectOne.mockResolvedValue(
        userWithPassword,
      );
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException if repository query fails', async () => {
      mockRepositoryContext.repository.selectOne.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(service.signIn(signInDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'test@example.com',
      name: 'New User',
      password: 'newpassword',
    };

    it('should sign up a new user successfully', async () => {
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      const createdUser = {
        ...signUpDto,
        id: '2',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepositoryContext.repository.selectOne.mockResolvedValue(null);
      mockRepositoryContext.repository.create.mockResolvedValue(createdUser);
      jest.spyOn(service['jwt'], 'signAsync').mockResolvedValue('token');

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        status: 'Success',
        statusCode: 201,
        message: ['User created'],
        data: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          token: 'token',
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(service, 'isUserExist').mockResolvedValue(true);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException if repository query fails', async () => {
      jest.spyOn(service, 'isUserExist').mockResolvedValue(false);
      mockRepositoryContext.repository.create.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('isUserExist', () => {
    const payload = { email: 'test@example.com' };

    it('should return true if user exists', async () => {
      mockRepositoryContext.repository.selectOne.mockResolvedValue(
        completeUser,
      );

      const result = await service.isUserExist(payload);

      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      mockRepositoryContext.repository.selectOne.mockResolvedValue(null);

      const result = await service.isUserExist(payload);

      expect(result).toBe(false);
    });

    it('should throw InternalServerErrorException if repository query fails', async () => {
      mockRepositoryContext.repository.selectOne.mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(service.isUserExist(payload)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
