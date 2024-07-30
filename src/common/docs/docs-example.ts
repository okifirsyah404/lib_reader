import { BaseResponse } from '../base/base';

export const internalServerErrorExample: BaseResponse<void> = {
  status: 'InternalServerErrorException',
  statusCode: 500,
  message: ['Internal server error'],
};

export const unauthorizedErrorExample: BaseResponse<void> = {
  status: 'UnauthorizedException',
  statusCode: 401,
  message: ['Unauthorized'],
};
