import { AuthDto } from '@/common/dto/auth.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto extends PickType(AuthDto, ['email', 'password']) {
  constructor(password: string) {
    super();
    this.password = password;
  }

  /**
   *
   *  Password field
   *
   * @example 'johndoepassword1234!'
   * @type {string}
   * @decorator IsString
   * @decorator IsNotEmpty
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
  readonly password: string;
}
