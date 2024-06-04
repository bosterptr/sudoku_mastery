import { createConnection } from 'typeorm';
import * as entities from '../db/entities';

const createTestDatabaseConn = async () =>
  createConnection({
    name: 'default',
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: `${process.env.TYPEORM_DATABASE}`,
    dropSchema: true,
    synchronize: true,
    logging: false,
    logger: undefined,
    entities: Object.values(entities),
  });
export default createTestDatabaseConn;
createTestDatabaseConn().then((x) => x.connect());
