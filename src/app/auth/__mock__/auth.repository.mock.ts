import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthRepository } from '../repository/auth.repository';

export type AuthRepositoryContext = {
  repository: AuthRepository;
};

export type MockAuthRepositoryContext = {
  repository: DeepMockProxy<AuthRepository>;
};

export const provideAuthRepositoryContext = (): MockAuthRepositoryContext => {
  return {
    repository: mockDeep<AuthRepository>(),
  };
};
