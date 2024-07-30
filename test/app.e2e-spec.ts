import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as request from 'supertest';
import { provideAppTester } from './helper/app-tester-provider';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await provideAppTester();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(302);
  });
});
