import { BasePaginatedResponse, BaseResponse } from '@common/base/base';

export abstract class BookDocsExample {
  private static readonly book = {
    id: 'clz8fzgm4000446a03ejtrh6f',
    title: 'Electronic Concrete Keyboard',
    isbn: '978-3-16-148410-0',
    coverUrl: 'https://picsum.photos/seed/UEnFye1xH/640/480',
    published: '2024-07-27T02:10:32.350Z',
    publisher: 'Publisher',
    pages: 247,
    language: 'EN',
    genres: ['Fiction'],
    description: 'A short description',
  };

  private static readonly authors = {
    id: 'clz8fz87b000346a03p6xkn7c',
    name: 'John Doe',
    birthday: '2017-03-07T20:26:52.350Z',
    bio: 'A short bio',
    country: 'Indonesia',
  };

  static readonly findMany: BasePaginatedResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Books found'],
    pagination: {
      page: 1,
      pageSize: 2,
      totalItems: 2,
      totalPages: 1,
    },
    data: [
      {
        ...this.book,
        authors: this.authors,
      },
      {
        ...this.book,
        authors: this.authors,
      },
    ],
  };

  static readonly findOne: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Book found'],
    data: {
      ...this.book,
      authors: this.authors,
    },
  };

  static readonly create: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 201,
    message: ['Book created'],
    data: {
      ...this.book,
      authors: this.authors,
    },
  };

  static readonly update: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Book updated'],
    data: {
      ...this.book,
      authors: this.authors,
    },
  };

  static readonly delete: BaseResponse<unknown> = {
    status: 'Success',
    statusCode: 200,
    message: ['Book deleted'],
  };

  static readonly notFound: BaseResponse<never> = {
    status: 'NotFoundException',
    statusCode: 404,
    message: ['Book not found'],
  };

  static readonly authorNotFound: BaseResponse<never> = {
    status: 'NotFoundException',
    statusCode: 404,
    message: ['Author not found'],
  };

  static readonly titleCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Title should not be empty', 'Title must be a string'],
  };

  static readonly languageCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Language should not be empty', 'Language must be a string'],
  };

  static readonly genresCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Genres should not be empty', 'Genres must be an array'],
  };

  static readonly isbnCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Isbn should not be empty', 'Isbn must be a string'],
  };

  static readonly publisherCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Publisher should not be empty', 'Publisher must be a string'],
  };

  static readonly publishedCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Published should not be empty',
      'Published must be a date instance',
    ],
  };

  static readonly authorIdCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Authorid should not be empty', 'Authorid must be a string'],
  };

  static readonly pagesCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Pages should not be empty',
      'Pages must not be less than 1',
      'Pages must be a number conforming to the specified constraints',
    ],
  };

  static readonly coverUrlCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Coverurl must be a string'],
  };

  static readonly descriptionCreateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Description must be a string'],
  };

  static readonly titleUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Title must be a string'],
  };

  static readonly languageUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Language must be a string'],
  };

  static readonly genresUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Genres must be an array'],
  };

  static readonly isbnUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Isbn must be a string'],
  };

  static readonly publisherUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Publisher must be a string'],
  };

  static readonly publishedUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Published must be a date instance'],
  };

  static readonly authorIdUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: ['Authorid must be a string'],
  };

  static readonly pagesUpdateValidation: BaseResponse<never> = {
    status: 'BadRequestException',
    statusCode: 400,
    message: [
      'Pages must not be less than 1',
      'Pages must be a number conforming to the specified constraints',
    ],
  };
}
