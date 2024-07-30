import 'dotenv/config';

export type AppConfig = {
  env: 'dev' | 'staging' | 'prod';
  host: string;
  port: number;
  pagination: {
    pageSize: number;
  };
};

export const appConfig: AppConfig = {
  env: (process.env.APP_ENV as AppConfig['env']) || 'dev',
  host: process.env.APP_HOST || '0.0.0.0',
  port: parseInt(process.env.APP_PORT || '3000'),
  pagination: {
    pageSize: parseInt(process.env.APP_PAGINATION_SIZE || '10'),
  },
} as const;
