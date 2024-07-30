import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { provideAppTester } from './helper/app-tester-provider';

import * as request from 'supertest';

process.setMaxListeners(0);

describe('Author (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;

  const endPoint = '/author';

  beforeEach(async () => {
    app = await provideAppTester();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const requestBody = {
      email: 'johndoe@example.com',
      password: 'johndoe@example.com',
    };

    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(requestBody)
      .expect(201)
      .expect((response) => {
        token = response.body.data.token;
      });
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`POST: ${endPoint} | Create Author Success`, () => {
    const requestBody = {
      name: 'John Doe',
      birthday: '2017-03-07T20:26:52.350Z',
      bio: 'A short bio',
      country: 'Indonesia',
    };

    const expectedResponse = {
      status: 'Success',
      statusCode: 201,
      message: ['Author created'],
      data: {
        id: expect.any(String),
        ...requestBody,
      },
    };

    it('should return 201 and right response', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject(expectedResponse);
        });
    });

    it('should return 201 and right response when bio is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          bio: undefined,
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...expectedResponse,
            data: {
              ...requestBody,
              bio: null,
            },
          });
        });
    });
  });

  describe(`POST: ${endPoint} | Create Author Failure`, () => {
    const requestBody = {
      name: 'John Doe',
      birthday: '2017-03-07T20:26:52.350Z',
      bio: 'A short bio',
      country: 'Indonesia',
    };

    it('should return 401 and right response when token is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .send(requestBody)
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 400 and right response when name is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          name: undefined,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Name should not be empty', 'Name must be a string'],
        });
    });

    it('should return 400 and right response when name is not string', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          name: 123,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Name must be a string'],
        });
    });

    it('should return 400 and right response when birthday is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          birthday: undefined,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Birthday should not be empty',
            'Birthday must be a date instance',
          ],
        });
    });

    it('should return 400 and right response when birthday is not ISO8601 date', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          birthday: 'invalid-date',
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Birthday must be a date instance'],
        });
    });

    it('should return 400 and right response when country is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          country: undefined,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Country should not be empty', 'Country must be a string'],
        });
    });

    it('should return 400 and right response when country is not string', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          country: 123,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Country must be a string'],
        });
    });
  });

  describe(`GET: ${endPoint} | Get Authors Success`, () => {
    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .get(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 'Success',
            statusCode: 200,
            message: ['Authors found'],
            pagination: {
              page: 1,
              pageSize: expect.any(Number),
              totalItems: expect.any(Number),
              totalPages: expect.any(Number),
            },
            data: expect.any(Array),
          });
        });
    });

    it('should return 200 and right response with pagination query', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 'Success',
            statusCode: 200,
            message: ['Authors found'],
            data: expect.any(Array),
            pagination: {
              page: 1,
              pageSize: 1,
              totalItems: expect.any(Number),
              totalPages: expect.any(Number),
            },
          });
        });
    });

    it('should return 200 and right response with search query', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?name=John`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 'Success',
            statusCode: 200,
            message: ['Authors found'],
            pagination: {
              page: 1,
              pageSize: expect.any(Number),
              totalItems: expect.any(Number),
              totalPages: expect.any(Number),
            },
            data: expect.any(Array),
          });
        })
        .expect((response) => {
          expect(response.body.data[0].name).toContain('John');
        });
    });
  });

  describe(`GET: ${endPoint} | Get Authors Failure`, () => {
    it('should return 401 and right response when token is not provided', async () => {
      return request(app.getHttpServer())
        .get(endPoint)
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 400 and right response when page is not number', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?page=invalid`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Page must not be less than 1',
            'Page must be an integer number',
          ],
        });
    });

    it('should return 400 and right response when page is less than 1', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?page=0`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Page must not be less than 1'],
        });
    });

    it('should return 400 and right response when size is not number', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?size=invalid`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Size must not be less than 1',
            'Size must be an integer number',
          ],
        });
    });

    it('should return 400 and right response when size is less than 1', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?size=0`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Size must not be less than 1'],
        });
    });
  });

  describe(`GET: ${endPoint}/{id} | Get Author Success`, () => {
    let authorId: string;

    beforeEach(async () => {
      const requestBody = {
        name: 'John Doe',
        birthday: '2017-03-07T20:26:52.350Z',
        bio: 'A short bio',
        country: 'Indonesia',
      };

      await request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(201)
        .expect((response) => {
          authorId = response.body.data.id;
        });
    });

    afterEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            status: 'Success',
            statusCode: 200,
            message: ['Author found'],
            data: {
              id: authorId,
              name: 'John Doe',
              birthday: '2017-03-07T20:26:52.350Z',
              bio: 'A short bio',
              country: 'Indonesia',
            },
          });
        });
    });
  });

  describe(`GET: ${endPoint}/{id} | Get Author Failure`, () => {
    it('should return 401 and right response when token is not provided', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/1`)
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 404 and right response when author is not found', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect({
          status: 'NotFoundException',
          statusCode: 404,
          message: ['Author not found'],
        });
    });
  });

  describe(`PUT: ${endPoint}/{id} | Update Author Success`, () => {
    let authorId: string;

    beforeEach(async () => {
      const requestBody = {
        name: 'John Doe',
        birthday: '2017-03-07T20:26:52.350Z',
        bio: 'A short bio',
        country: 'Indonesia',
      };

      await request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(201)
        .expect((response) => {
          authorId = response.body.data.id;
        });
    });

    afterEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    const requestBody = {
      name: 'Jane Doe',
      birthday: '2017-03-07T20:26:52.350Z',
      bio: 'A long bio',
      country: 'Indonesia',
    };

    const expectedResponse = {
      status: 'Success',
      statusCode: 200,
      message: ['Author updated'],
      data: {
        id: expect.any(String),
        ...requestBody,
      },
    };

    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject(expectedResponse);
        });
    });

    it('should return 200 and right response when bio is not provided', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          bio: undefined,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...expectedResponse,
            data: {
              ...requestBody,
              bio: response.body.data.bio,
            },
          });
        });
    });
  });

  describe(`PUT: ${endPoint}/{id} | Update Author Failure`, () => {
    let authorId: string;

    const requestBody = {
      name: 'Jane Doe',
      birthday: '2017-03-07T20:26:52.350Z',
      bio: 'A long bio',
      country: 'Indonesia',
    };

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(201)
        .expect((response) => {
          authorId = response.body.data.id;
        });
    });

    afterEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 401 and right response when token is not provided', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .send(requestBody)
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 400 and right response when name is not string', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          name: 123,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Name must be a string'],
        });
    });

    it('should return 400 and right response when birthday is not ISO8601 date', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          birthday: 'invalid-date',
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Birthday must be a date instance'],
        });
    });

    it('should return 400 and right response when country is not string', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          country: 123,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Country must be a string'],
        });
    });

    it('should return 401 and right response when bio is not string', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          bio: 123,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Bio must be a string'],
        });
    });

    it('should return 404 and right response when author is not found', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/1`)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(404)
        .expect({
          status: 'NotFoundException',
          statusCode: 404,
          message: ['Author not found'],
        });
    });
  });

  describe(`DELETE: ${endPoint}/{id} | Delete Author Success`, () => {
    let authorId: string;

    beforeEach(async () => {
      const requestBody = {
        name: 'John Doe',
        birthday: '2017-03-07T20:26:52.350Z',
        bio: 'A short bio',
        country: 'Indonesia',
      };

      await request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(201)
        .expect((response) => {
          authorId = response.body.data.id;
        });
    });

    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .delete(`${endPoint}/${authorId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect({
          status: 'Success',
          statusCode: 200,
          message: ['Author deleted'],
        });
    });
  });

  describe(`DELETE: ${endPoint}/{id} | Delete Author Failure`, () => {
    it('should return 401 and right response when token is not provided', async () => {
      return request(app.getHttpServer())
        .delete(`${endPoint}/1`)
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 404 and right response when author is not found', async () => {
      return request(app.getHttpServer())
        .delete(`${endPoint}/1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect({
          status: 'NotFoundException',
          statusCode: 404,
          message: ['Author not found'],
        });
    });
  });
});
