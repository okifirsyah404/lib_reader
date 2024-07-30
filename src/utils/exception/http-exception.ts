import { BaseResponse } from '@/common/base/base';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { FastifyReply } from 'fastify';

/**
 * Class for describing implementation of an exception filter
 *
 * This class will catch all HttpException and send the response with the status code and message.
 */
@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const status = exception.getStatus();

    let baseResponse: BaseResponse<never>;

    const message = (exception.getResponse() as { message: string[] }).message;

    if (exception.message.includes('ENOENT')) {
      baseResponse = {
        status: 'NotFoundException',
        statusCode: 404,
        message: ['Resource not found'],
      } as BaseResponse<never>;

      return response.status(404).send(baseResponse);
    }

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);

      baseResponse = {
        status: 'InternalServerError',
        statusCode: 500,
        message: ['Internal server error'],
      } as BaseResponse<never>;

      return response.status(500).send(baseResponse);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);

      baseResponse = {
        status: 'InternalServerError',
        statusCode: 500,
        message: ['Internal server error'],
      } as BaseResponse<never>;

      return response.status(500).send(baseResponse);
    });

    baseResponse = {
      status: exception.name,
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
    } as BaseResponse<never>;

    response.status(status).send(baseResponse);
  }
}
