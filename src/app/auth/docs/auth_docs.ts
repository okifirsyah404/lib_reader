import { BaseResponse } from '@common/base/base';

export abstract class AuthDocsExample {
  private static readonly token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsejduMmUzZzAwMDBkdGMzMjJ0cWUxOHYiLCJlbWFpbCI6ImpvaG5kb2UxQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIyMjk2ODMzLCJleHAiOjE3MjIzODMyMzN9.HlNm54BC8cfvXfi91xV6rDchgHN_ZTLeBAYIEtT0hd8';

  private static readonly user = {
    id: 'clz7n2e3g0000dtc322tqe18v',
    email: 'johndoe1@example.com',
    name: 'John Doe',
  };

  static readonly login: BaseResponse<{ token: string }> = {
    status: 'Success',
    statusCode: 200,
    message: ['Login successful'],
    data: {
      token: this.token,
    },
  };

  static readonly register: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 201,
    message: ['User created'],
    data: {
      ...this.user,
      token: this.token,
    },
  };

  static readonly emailSignInValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Email is invalid',
      'Email should not be empty',
      'Email must be a string',
    ],
  };

  static readonly passwordSignInValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Password should not be empty', 'Password must be a string'],
  };

  static readonly nameSignUpValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Name should not be empty', 'Name must be a string'],
  };

  static readonly emailSignUpValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Email is invalid',
      'Email should not be empty',
      'Email must be a string',
    ],
  };

  static readonly passwordSignUpValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Password should not be empty', 'Password must be a string'],
  };

  static readonly unauthorizedLogin: BaseResponse<never> = {
    status: 'UnauthorizedException',
    statusCode: 401,
    message: ['Invalid password'],
  };

  static readonly notFound: BaseResponse<never> = {
    status: 'NotFoundException',
    statusCode: 404,
    message: ['User not found'],
  };

  static readonly conflictRegister: BaseResponse<never> = {
    status: 'ConflictException',
    statusCode: 409,
    message: ['User already exists'],
  };
}
