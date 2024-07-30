import { DocsTag } from '@/common/docs/docs-tag';
import { internalServerErrorExample } from '@docs/docs-example';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../service/auth.service';

@ApiTags(DocsTag.auth)
@Controller('auth')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  schema: {
    example: internalServerErrorExample,
  },
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  /**
   * Http POST method for signing in a user.
   *
   * Body:
   * - email: string - The user's email.
   * - password: string - The user's password.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - The response message.
   * - data: object - The response data.
   */
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse({})
  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.service.signIn(body);
  }

  /**
   * Http POST method for signing up a new user.
   *
   * Body:
   * - email: string - The user's email.
   * - password: string - The user's password.
   *
   * Response:
   * - status: string - The status of the response.
   * - statusCode: number - The status code of the response.
   * - message: string[] - The response message.
   * - data: object - The response data
   */
  @Post('sign-up')
  @ApiCreatedResponse({})
  @ApiConflictResponse({})
  signUp(@Body() body: SignUpDto) {
    return this.service.signUp(body);
  }
}
