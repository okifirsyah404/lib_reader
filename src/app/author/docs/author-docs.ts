import { BasePaginatedResponse, BaseResponse } from '@/common/base/base';

export abstract class AuthorDocsExample {
  private static readonly author = {
    id: 'clz3hv4qo0001xugjebd0g9jv',
    name: 'Yvette Donnelly',
    birthday: '2017-03-07T20:26:52.350Z',
    bio: 'food enthusiast  🐣',
    country: 'Mauritius',
  };

  private static readonly book = {
    id: 'clz3hv4tb0002xugjserptow0',
    title: 'Electronic Concrete Keyboard',
    isbn: '978-0-463-79317-6',
    coverUrl: 'https://picsum.photos/seed/UEnFye1xH/640/480',
    published: '2024-07-27T02:10:32.350Z',
    publisher: 'Zboncak Group',
    pages: 247,
    language: 'VI',
    genres: ['Fiction'],
    description:
      'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
  };

  static readonly findAll: BasePaginatedResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Authors found'],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 100,
      totalPages: 10,
    },
    data: [
      {
        ...this.author,
        books: [this.book, this.book],
      },
      {
        ...this.author,
        books: [this.book, this.book],
      },
    ],
  };

  static readonly findOne: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Author found'],
    data: {
      ...this.author,
      books: [this.book, this.book],
    },
  };

  static readonly create: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 201,
    message: ['Author created'],
    data: this.author,
  };

  static readonly update: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Author updated'],
    data: this.author,
  };

  static readonly delete: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Author deleted'],
  };

  static readonly nameCreateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Name should not be empty', 'Name must be a string'],
  };

  static readonly birthdayCreateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Birthday should not be empty',
      'Birthday must be a date instance',
    ],
  };

  static readonly countryCreateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Country should not be empty', 'Country must be a string'],
  };

  static readonly bioCreateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Bio must be a string'],
  };

  static readonly nameUpdateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Name should not be empty', 'Name must be a string'],
  };

  static readonly birthdayUpdateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Birthday should not be empty',
      'Birthday must be a date instance',
    ],
  };

  static readonly countryUpdateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Country should not be empty', 'Country must be a string'],
  };

  static readonly bioUpdateValidation: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Bio must be a string'],
  };

  static readonly notFound: BaseResponse<unknown> = {
    status: 'NotFoundException',
    statusCode: 404,
    message: ['Author not found'],
    data: undefined,
  };

  static readonly badRequest: BaseResponse<unknown> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Name should not be empty'],
    data: undefined,
  };
}
