import DiKey from '@common/res/di/di-key';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModuleOptions } from '../interface/database.interface';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const option: DatabaseModuleOptions = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: DiKey.DatabaseOption,
          useValue: option,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
