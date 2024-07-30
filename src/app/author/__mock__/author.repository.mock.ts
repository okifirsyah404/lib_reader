import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthorRepository } from '../repository/author.repository';

export type AuthorRepositoryContext = {
  repository: AuthorRepository;
};

export type MockAuthorRepositoryContext = {
  repository: DeepMockProxy<AuthorRepository>;
};

export const provideAuthorRepositoryContext =
  (): MockAuthorRepositoryContext => {
    return {
      repository: mockDeep<AuthorRepository>(),
    };
  };
