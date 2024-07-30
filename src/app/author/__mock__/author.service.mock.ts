import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthorService } from '../service/author.service';

export type AuthorServiceContext = {
  service: AuthorService;
};

export type MockAuthorServiceContext = {
  service: DeepMockProxy<AuthorService>;
};

export const provideAuthorServiceContext = (): MockAuthorServiceContext => {
  return {
    service: mockDeep<AuthorService>(),
  };
};
