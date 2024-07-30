import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { DatabaseService } from '../service/database.service';

export type DatabaseContext = {
  database: DatabaseService;
};

export type MockDatabaseContext = {
  database: DeepMockProxy<DatabaseService>;
};

export const provideDatabaseContext = (): MockDatabaseContext => {
  return {
    database: mockDeep<DatabaseService>(),
  };
};
