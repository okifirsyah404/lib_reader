import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class AuthDto {
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  /**
   *
   *  Name field
   *
   * @example 'John Doe'
   * @type {string}
   * @decorator IsString
   * @decorator IsNotEmpty
   */
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name should not be empty',
  })
  readonly name: string;

  /**
   *
   *  Email field
   *
   * @example 'johndoe@example.com'
   * @type {string}
   * @decorator IsString
   * @decorator IsNotEmpty
   * @decorator IsEmail
   *
   */
  @ApiProperty({
    example: 'johndoe@example.com',
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsNotEmpty({
    message: 'Email should not be empty',
  })
  @IsEmail(
    {},
    {
      message: 'Email is invalid',
    },
  )
  readonly email: string;

  /**
   *
   *  Password field
   *
   * @example 'johndoepassword1234!'
   * @type {string}
   * @decorator IsString
   * @decorator IsNotEmpty
   * @decorator IsStrongPassword
   */
  @ApiProperty({
    example: 'johndoepassword1234!',
  })
  @IsString({
    message: 'Password must be a string',
  })
  @IsNotEmpty({
    message: 'Password should not be empty',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
      minNumbers: 4,
    },
    {
      message: 'Password is too weak',
    },
  )
  readonly password: string;
}
