import { Connection, getConnection } from 'typeorm';

export const getEntities = async () => {
  const entities: { name: string; tableName: string }[] = [];
  getConnection().entityMetadatas.forEach((x) =>
    entities.push({ name: x.name, tableName: x.tableName })
  );
  return entities;
};

/**
 * Cleans all the entities
 */
export const cleanDB = async () => {
  try {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const entities = await getEntities();
    await queryRunner.startTransaction();
    try {
      const queries = [];
      for (let i = 0; i < entities.length; i += 1) {
        const repository = getConnection().getRepository(entities[i].name);
        queries.push(
          repository.query(`DELETE FROM "${entities[i].tableName}";`)
        );
      }
      await Promise.all(queries);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
};

export const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const reloadDatabase = async (connection: Connection) => {
  if (!connection) throw new Error('DB connection is not established');
  await cleanDB();
};
