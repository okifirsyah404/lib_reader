import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { provideAppTester } from './helper/app-tester-provider';

import * as request from 'supertest';

process.setMaxListeners(0);

describe('Author (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;

  const endPoint = '/book';

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

  describe(`POST: ${endPoint} | Create Book Success`, () => {
    let authorId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get('/author?page=1&name=John&size=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          authorId = response.body.data[0].id;
        });
    });

    const requestBody = {
      title: 'Electronic Concrete Keyboard',
      language: 'EN',
      genres: ['Fiction'],
      isbn: '978-3-16-148410-0',
      publisher: 'Publisher',
      published: '2024-07-27T02:10:32.350Z',
      pages: 247,
      coverUrl: 'https://picsum.photos/seed/UEnFye1xH/640/480',
      description: 'A short description',
    };

    const expectedResponse = {
      status: 'Success',
      statusCode: 201,
      message: ['Book created'],
      data: expect.objectContaining({
        id: expect.any(String),
        title: requestBody.title,
        language: requestBody.language,
        genres: requestBody.genres,
        isbn: requestBody.isbn,
        publisher: requestBody.publisher,
        published: requestBody.published,
        pages: requestBody.pages,
        coverUrl: requestBody.coverUrl,
        description: requestBody.description,
        authors: expect.objectContaining({
          id: expect.any(String),
        }),
      }),
    };

    it('should return 201 and right response', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          authorId,
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject(expectedResponse);
        });
    });
  });

  describe(`POST: ${endPoint} | Create Book Failure`, () => {
    let authorId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get('/author?page=1&name=John&size=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          authorId = response.body.data[0].id;
        });
    });

    const requestBody = {
      title: 'Electronic Concrete Keyboard',
      language: 'EN',
      genres: ['Fiction'],
      isbn: '978-3-16-148410-0',
      publisher: 'Publisher',
      published: '2024-07-27T02:10:32.350Z',
      pages: 247,
      coverUrl: 'https://picsum.photos/seed/UEnFye1xH/640/480',
      description: 'A short description',
    };

    it('should return 401 when token is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .send({
          ...requestBody,
          authorId,
        })
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 400 when title is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          title: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Title should not be empty', 'Title must be a string'],
        });
    });

    it('should return 400 when language is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          language: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Language should not be empty',
            'Language must be a string',
          ],
        });
    });

    it('should return 400 when genres is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          genres: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Genres should not be empty', 'Genres must be an array'],
        });
    });

    it('should return 400 when isbn is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          isbn: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: ['Isbn should not be empty', 'Isbn must be a string'],
        });
    });

    it('should return 400 when publisher is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          publisher: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Publisher should not be empty',
            'Publisher must be a string',
          ],
        });
    });

    it('should return 400 when published is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          published: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Published should not be empty',
            'Published must be a date instance',
          ],
        });
    });

    it('should return 400 when authorId is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody)
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Authorid should not be empty',
            'Authorid must be a string',
          ],
        });
    });

    it('should return 404 when authorId is invalid', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          authorId: 'invalid-id',
        })
        .expect(404)
        .expect({
          status: 'NotFoundException',
          statusCode: 404,
          message: ['Author not found'],
        });
    });

    it('should return 400 when pages is not provided', async () => {
      return request(app.getHttpServer())
        .post(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          pages: undefined,
          authorId,
        })
        .expect(400)
        .expect({
          status: 'BadRequestException',
          statusCode: 400,
          message: [
            'Pages should not be empty',
            'Pages must not be less than 1',
            'Pages must be a number conforming to the specified constraints',
          ],
        });
    });
  });

  describe(`GET: ${endPoint} | Get All Books`, () => {
    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .get(endPoint)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'Success',
            statusCode: 200,
            message: ['Books found'],
            pagination: {
              page: 1,
              pageSize: 10,
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
          expect(response.body).toEqual({
            status: 'Success',
            statusCode: 200,
            message: ['Books found'],
            pagination: {
              page: 1,
              pageSize: 1,
              totalItems: expect.any(Number),
              totalPages: expect.any(Number),
            },
            data: expect.any(Array),
          });
        });
    });

    it('should return 200 and right response with search query', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1&title=Electronic`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'Success',
            statusCode: 200,
            message: ['Books found'],
            pagination: {
              page: 1,
              pageSize: 1,
              totalItems: expect.any(Number),
              totalPages: expect.any(Number),
            },
            data: expect.any(Array),
          });
        });
    });
  });

  describe(`GET: ${endPoint} | Get All Books Failure`, () => {
    it('should return 401 when token is not provided', async () => {
      return request(app.getHttpServer())
        .get(endPoint)
        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'UnauthorizedException',
            statusCode: 401,
            message: ['Unauthorized'],
          });
        });
    });

    it('should return 400 when page is not a number', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?page=invalid&size=1`)
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

    it('should return 400 when size is not a number', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=invalid`)
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
  });

  describe(`GET: ${endPoint}/:id | Get Book By Id`, () => {
    let bookId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          bookId = response.body.data[0].id;
        });
    });

    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'Success',
            statusCode: 200,
            message: ['Book found'],
            data: expect.objectContaining({
              id: bookId,
            }),
          });
        });
    });
  });

  describe(`GET: ${endPoint}/:id | Get Book By Id Failure`, () => {
    it('should return 401 when token is not provided', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/1`)
        .expect(401)
        .expect({
          status: 'UnauthorizedException',
          statusCode: 401,
          message: ['Unauthorized'],
        });
    });

    it('should return 404 when bookId is invalid', async () => {
      return request(app.getHttpServer())
        .get(`${endPoint}/invalid-id`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect({
          status: 'NotFoundException',
          statusCode: 404,
          message: ['Book not found'],
        });
    });
  });

  describe(`PUT: ${endPoint}/:id | Update Book By Id`, () => {
    let bookId: string;
    let authorId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          bookId = response.body.data[0].id;
          authorId = response.body.data[0].authors.id;
        });
    });

    const requestBody = {
      title: 'Electronic Concrete Keyboard',
      language: 'EN',
      genres: ['Fiction'],
      isbn: '978-3-16-148410-0',
      publisher: 'Publisher',
      published: '2024-07-27T02:10:32.350Z',
      pages: 247,
      coverUrl: 'https://picsum.photos/seed/UEnFye1xH/640/480',
      description: 'A short description',
    };

    const expectedResponse = {
      status: 'Success',
      statusCode: 200,
      message: ['Book updated'],
      data: expect.objectContaining({
        id: expect.any(String),
        ...requestBody,
        authors: expect.any(Object),
      }),
    };

    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          authorId,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject(expectedResponse);
        });
    });
  });

  describe(`PUT: ${endPoint}/:id | Update Book By Id Failure`, () => {
    let bookId: string;
    let authorId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          bookId = response.body.data[0].id;
          authorId = response.body.data[0].authors.id;
        });
    });

    const requestBody = {
      title: 'Electronic Concrete Keyboard',
      language: 'EN',
      genres: ['Fiction'],
      isbn: '978-3-16-148410-0',
      publisher: 'Publisher',
      published: '2024-07-27T02:10:32.350Z',
      pages: 247,
      coverUrl: 'https://picsum.photos/seed/UEnFye1xH/640/480',
      description: 'A short description',
    };

    it('should return 401 when token is not provided', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${bookId}`)
        .send({
          ...requestBody,
          authorId,
        })
        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'UnauthorizedException',
            statusCode: 401,
            message: ['Unauthorized'],
          });
        });
    });

    it('should return 404 when bookId is invalid', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/invalid-id`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          authorId,
        })
        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'NotFoundException',
            statusCode: 404,
            message: ['Book not found'],
          });
        });
    });

    it('should return 404 when authorId is invalid', async () => {
      return request(app.getHttpServer())
        .put(`${endPoint}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...requestBody,
          authorId: 'invalid-id',
        })
        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'NotFoundException',
            statusCode: 404,
            message: ['Author not found'],
          });
        });
    });
  });

  describe(`DELETE: ${endPoint}/:id | Delete Book By Id`, () => {
    let bookId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          bookId = response.body.data[0].id;
        });
    });

    it('should return 200 and right response', async () => {
      return request(app.getHttpServer())
        .delete(`${endPoint}/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'Success',
            statusCode: 200,
            message: ['Book deleted'],
          });
        });
    });
  });

  describe(`DELETE: ${endPoint}/:id | Delete Book By Id Failure`, () => {
    let bookId: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .get(`${endPoint}?page=1&size=1`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          bookId = response.body.data[0].id;
        });
    });

    it('should return 401 when token is not provided', async () => {
      return request(app.getHttpServer())
        .delete(`${endPoint}/${bookId}`)
        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'UnauthorizedException',
            statusCode: 401,
            message: ['Unauthorized'],
          });
        });
    });

    it('should return 404 when bookId is invalid', async () => {
      return request(app.getHttpServer())
        .delete(`${endPoint}/invalid-id`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual({
            status: 'NotFoundException',
            statusCode: 404,
            message: ['Book not found'],
          });
        });
    });
  });
});
