import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthService } from '../service/auth.service';

export type AuthServiceContext = {
  service: AuthService;
};

export type MockAuthServiceContext = {
  service: DeepMockProxy<AuthService>;
};

export const provideAuthServiceContext = (): MockAuthServiceContext => {
  return {
    service: mockDeep<AuthService>(),
  };
};
