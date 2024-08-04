import { DocsTag } from '@/common/docs/docs-tag';
import { internalServerErrorExample } from '@docs/docs-example';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDocsExample } from '../docs/auth_docs';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../service/auth.service';

@ApiTags(DocsTag.auth)
@Controller('auth')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  content: {
    'application/json': {
      example: internalServerErrorExample,
    },
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

  @ApiCreatedResponse({
    description: 'User logged in',
    content: {
      'application/json': {
        example: AuthDocsExample.login,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    content: {
      'application/json': {
        examples: {
          'Validation - Email': {
            value: AuthDocsExample.emailSignInValidation,
          },
          'Validation - Password': {
            value: AuthDocsExample.passwordSignInValidation,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password',
    content: {
      'application/json': {
        example: AuthDocsExample.unauthorizedLogin,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    content: {
      'application/json': {
        example: AuthDocsExample.notFound,
      },
    },
  })
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
  @ApiCreatedResponse({
    description: 'User created',
    content: {
      'application/json': {
        example: AuthDocsExample.register,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    content: {
      'application/json': {
        examples: {
          'Validation - Name': {
            value: AuthDocsExample.nameSignUpValidation,
          },
          'Validation - Email': {
            value: AuthDocsExample.emailSignUpValidation,
          },
          'Validation - Password': {
            value: AuthDocsExample.passwordSignUpValidation,
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'User already exists',
    content: {
      'application/json': {
        example: AuthDocsExample.conflictRegister,
      },
    },
  })
  signUp(@Body() body: SignUpDto) {
    return this.service.signUp(body);
  }
}
