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

export const pageValidationErrorExample: BaseResponse<void> = {
  status: 'BadRequestException',
  statusCode: 400,
  message: [
    'Page must not be less than 1',
    'Page must be an integer number',
    'Size must not be less than 1',
    'Size must be an integer number',
  ],
};
