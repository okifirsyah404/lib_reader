import { ModuleMetadata } from '@nestjs/common';

export type PagingDatabase<T> = {
  page: number;
  limit: number;
  totalItems: number;
  data: T[];
};

export interface DatabaseModuleOptions {
  logs?: boolean;
  imports?: any[];
}

export interface DatabaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
  inject?: any[];
  imports?: any[];
}
