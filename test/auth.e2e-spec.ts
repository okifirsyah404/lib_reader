import { NestFastifyApplication } from '@nestjs/platform-fastify';

import * as request from 'supertest';
import { provideAppTester } from './helper/app-tester-provider';

process.setMaxListeners(0);

describe('Auth (e2e)', () => {
  let app: NestFastifyApplication;
  const signInPath = '/auth/sign-in';
  const signUpPath = '/auth/sign-up';

  beforeEach(async () => {
    app = await provideAppTester();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`POST: ${signInPath} | Sign In Success`, () => {
    const requestBody = {
      email: 'johndoe@example.com',
      password: 'johndoe@example.com',
    };

    const expectedResponse = {
      status: 'Success',
      statusCode: 201,
      message: ['User signed in'],
      data: expect.objectContaining({
        token: expect.any(String),
      }),
    };

    it('should return 201 and right response', async () => {
      return request(app.getHttpServer())
        .post(signInPath)
        .send(requestBody)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject(expectedResponse);
        });
    });
  });

  describe(`POST: ${signInPath} | Sign In Failure`, () => {
    const requestBody = {
      email: 'johndoe@example.com',
      password: 'failure',
    };

    it('should return 404 when user not found', async () => {
      return request(app.getHttpServer())
        .post(signInPath)
        .send({
          ...requestBody,
          email: 'failure@example.com',
        })
        .expect(404);
    });

    it('should return 401 when password is incorrect', async () => {
      return request(app.getHttpServer())
        .post(signInPath)
        .send(requestBody)
        .expect(401);
    });

    it('should return 400 when email is not provided', async () => {
      return request(app.getHttpServer())
        .post(signInPath)
        .send({
          ...requestBody,
          email: '',
        })
        .expect(400);
    });

    it('should return 400 when password is not provided', async () => {
      return request(app.getHttpServer())
        .post(signInPath)
        .send({ ...requestBody, password: '' })
        .expect(400);
    });
  });

  describe(`POST: ${signUpPath} | Sign Up Success`, () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@example.com',
      password: '2ZBGDoYDyzU!HVaAI4KbCousVK3hqJUEgR5eC',
    };

    const expectedResponse = {
      status: 'Success',
      statusCode: 201,
      message: ['User created'],
    };

    it('should return 201 and token', async () => {
      const randomEmail = `test${Math.floor(Math.random() * 100000)}@example.com`;
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          ...requestBody,
          email: randomEmail,
        })
        .expect(201);
    });

    it('should return expected response', async () => {
      const randomEmail = `test${Math.floor(Math.random() * 100000)}@example.com`;

      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          ...requestBody,
          email: randomEmail,
        })
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...expectedResponse,
            data: expect.objectContaining({
              id: expect.any(String),
              email: randomEmail,
              name: requestBody.name,
              token: expect.any(String),
            }),
          });
        });
    });
  });

  describe(`POST: ${signUpPath} | Sign Up Failure`, () => {
    const testEmail = 'test@example.com';
    const strongPassword = 'ZBGDoY1DyzUHV3!aAIKbCousVKh2qJUEgRe4C';

    it('should return 400 and right response when name is not provided', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: testEmail,
          password: strongPassword,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: ['Name should not be empty', 'Name must be a string'],
          });
        });
    });

    it('should return 400 and right response when name is not string', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: testEmail,
          name: 123,
          password: strongPassword,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: ['Name must be a string'],
          });
        });
    });

    it('should return 400 and right response when email is not provided', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          name: 'Test User',
          password: strongPassword,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: [
              'Email is invalid',
              'Email should not be empty',
              'Email must be a string',
            ],
          });
        });
    });

    it('should return 400 and right response when email is not string', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: 123,
          name: 'Test User',
          password: strongPassword,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: ['Email is invalid', 'Email must be a string'],
          });
        });
    });

    it('should return 400 and right response when email is invalid', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: 'invalid-email',
          name: 'Test User',
          password: strongPassword,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: ['Email is invalid'],
          });
        });
    });

    it('should return 409 and right response when email is already taken', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: 'johndoe@example.com',
          name: 'Test User',
          password: strongPassword,
        })
        .expect(409)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'ConflictException',
            statusCode: 409,
            message: ['User already exists'],
          });
        });
    });

    it('should return 400 and right response when password is not provided', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: testEmail,
          name: 'Test User',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: [
              'Password is too weak',
              'Password should not be empty',
              'Password must be a string',
            ],
          });
        });
    });

    it('should return 400 and right response when password is not string', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: testEmail,
          name: 'Test User',
          password: 123,
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: ['Password is too weak', 'Password must be a string'],
          });
        });
    });

    it('should return 400 and right response when password is weak', async () => {
      return request(app.getHttpServer())
        .post(signUpPath)
        .send({
          email: testEmail,
          name: 'Test User',
          password: 'weakpassword',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'BadRequestException',
            statusCode: 400,
            message: ['Password is too weak'],
          });
        });
    });
  });
});
