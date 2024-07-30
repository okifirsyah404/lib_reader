import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BookService } from '../service/book.service';

export type BookServiceContext = {
  service: BookService;
};

export type MockBookServiceContext = {
  service: DeepMockProxy<BookService>;
};

export const provideBookServiceContext = (): MockBookServiceContext => {
  return {
    service: mockDeep<BookService>(),
  };
};
