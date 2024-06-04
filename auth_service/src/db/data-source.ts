import { DataSource, LoggerOptions } from 'typeorm';
import dotenv from 'dotenv';
import * as entities from './entities';

dotenv.config();

// eslint-disable-next-line import/prefer-default-export
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: process.env.TYPEORM_LOGGING as LoggerOptions,
  entities: Object.values(entities),
  migrations: ['src/db/migrations/**/*.ts', 'dist/db/migrations/**/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
