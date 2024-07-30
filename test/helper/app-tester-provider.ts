import { AppMockModule } from '@app/__mock__/app.module.mock';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import HttpExceptionFilter from '@utils/exception/http-exception';
import { validationExceptionFactory } from '@validation/validation.factory';

export async function provideAppTester() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppMockModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
    {
      logger: false,
      bufferLogs: false,
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => validationExceptionFactory(errors),
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  return app;
}
