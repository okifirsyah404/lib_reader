import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Signs in a user with the provided credentials.
   * @param dto - The sign-in data transfer object containing the user's email and password.
   * @returns A promise that resolves to an object containing the sign-in status, message, and token.
   * @throws `InternalServerErrorException` If there is an error while querying the repository.
   * @throws `NotFoundException` If the user is not found.
   * @throws `UnauthorizedException` If the password is invalid.
   */
  async signIn(dto: SignInDto) {
    const result = await this.repository
      .selectOne(dto.email, {
        password: true,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(dto.password, result.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      status: 'Success',
      statusCode: 201,
      message: ['User signed in'],
      data: {
        token: await this.jwt.signAsync({ id: result.id, email: result.email }),
      },
    };
  }

  /**
   * Signs up a new user.
   *
   * @param dto - The sign up data transfer object.
   * @returns An object containing the status, status code, message, and user data.
   * @throws `InternalServerErrorException` if there is an error creating the user.
   */
  async signUp(dto: SignUpDto) {
    if (await this.isUserExist(dto)) {
      throw new ConflictException('User already exists');
    }

    const result = await this.repository.create(dto).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    return {
      status: 'Success',
      statusCode: 201,
      message: ['User created'],
      data: {
        id: result.id,
        email: result.email,
        name: result.name,
        token: await this.jwt.signAsync({ id: result.id, email: result.email }),
      },
    };
  }

  /**
   * Checks if a user exists based on the provided payload.
   * @param payload - The payload containing the user's email.
   * @returns A boolean indicating whether the user exists or not.
   * @throws `InternalServerErrorException` If there is an error while querying the repository.
   */
  async isUserExist(payload: any): Promise<boolean> {
    const result = await this.repository
      .selectOne((payload as any).email)
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return result !== null;
  }
}
