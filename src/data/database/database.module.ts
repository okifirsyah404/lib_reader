import DiKey from '@/common/res/di/di-key';
import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  DatabaseModuleAsyncOptions,
  DatabaseModuleOptions,
} from './interface/database.interface';
import { DatabaseService } from './service/database.service';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(option?: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [],
      providers: [
        {
          provide: DiKey.DatabaseOption,
          useValue: option,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }

  static forRootAsync(option?: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: option?.imports || [],
      providers: [
        {
          inject: option?.inject || [],
          provide: DiKey.DatabaseOption,
          useFactory: async (...args: any[]) => {
            const result = await option?.useFactory?.(...args);
            return result;
          },
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
