import swaggerDocumentBuilder from '@/common/docs/docs';
import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import HttpExceptionFilter from '@utils/exception/http-exception';
import { validationExceptionFactory } from '@validation/validation.factory';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
      cors: true,
    },
  );

  app.register(helmet);
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => validationExceptionFactory(errors),
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  swaggerDocumentBuilder(app);

  await app.listen(appConfig.port, appConfig.host);

  app.get(Logger).log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
