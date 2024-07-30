import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BookRepository } from '../repository/book.repository';

export type BookRepositoryContext = {
  repository: BookRepository;
};

export type MockBookRepositoryContext = {
  repository: DeepMockProxy<BookRepository>;
};

export const provideBookRepositoryContext = (): MockBookRepositoryContext => {
  return {
    repository: mockDeep<BookRepository>(),
  };
};
