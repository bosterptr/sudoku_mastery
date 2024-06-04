import { DataSource, createConnection } from 'typeorm';
import * as entities from './entities';
import * as migrations from './migrations';

export const createDatabaseConnection = async (): Promise<DataSource> =>
  createConnection({
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: Object.values(entities),
    migrations: Object.values(migrations),
  });

export default createDatabaseConnection;
