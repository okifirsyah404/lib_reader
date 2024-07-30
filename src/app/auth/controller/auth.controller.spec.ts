import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { provideAuthRepositoryContext } from '../__mock__/auth.repository.mock';
import {
  MockAuthServiceContext,
  provideAuthServiceContext,
} from '../__mock__/auth.service.mock';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthRepository } from '../repository/auth.repository';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthServiceContext: MockAuthServiceContext;

  beforeEach(async () => {
    mockAuthServiceContext = provideAuthServiceContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthServiceContext.service,
        },
        {
          provide: AuthRepository,
          useValue: provideAuthRepositoryContext().repository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    const expectedResult = {
      status: 'Success',
      statusCode: 201,
      message: ['User signed in'],
      data: {
        token: 'some-token',
      },
    };

    it('should return a token', async () => {
      const signInDto: SignInDto = { email: 'test', password: 'test' };
      const token = 'some-token';
      mockAuthServiceContext.service.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);
      expect(result.data.token).toBe(token);
    });

    it("should throw an error for user doesn't exist", async () => {
      const signInDto: SignInDto = { email: 'test', password: 'test' };
      mockAuthServiceContext.service.signIn.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error for invalid credentials', async () => {
      const signInDto: SignInDto = { email: 'test', password: 'test' };
      mockAuthServiceContext.service.signIn.mockRejectedValue(
        new UnauthorizedException('Invalid password'),
      );

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error for internal server error', async () => {
      const signInDto: SignInDto = { email: 'test', password: 'test' };
      mockAuthServiceContext.service.signIn.mockRejectedValue(
        new InternalServerErrorException('Internal server error'),
      );

      await expect(controller.signIn(signInDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('signUp', () => {
    const expectedResult = {
      status: 'Success',
      statusCode: 201,
      message: ['User signed up'],
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'test',
        token: 'some-token',
      },
    };

    it('should return a token', async () => {
      const signUpDto: SignUpDto = {
        name: 'test',
        email: 'test',
        password: 'test',
      };
      mockAuthServiceContext.service.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);
      expect(result.data.token).toBe(expectedResult.data.token);
    });
  });

  it('should throw an error for invalid data', async () => {
    const signUpDto: SignUpDto = {
      name: 'test',
      email: 'invalid-email',
      password: 'test',
    };
    mockAuthServiceContext.service.signUp.mockRejectedValue(
      new BadRequestException('Invalid data'),
    );

    await expect(controller.signUp(signUpDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error for internal server error', async () => {
    const signUpDto: SignUpDto = {
      name: 'test',
      email: 'test',
      password: 'test',
    };
    mockAuthServiceContext.service.signUp.mockRejectedValue(
      new InternalServerErrorException('Internal server error'),
    );

    await expect(controller.signUp(signUpDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
