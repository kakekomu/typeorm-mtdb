import { DBInstancesEntity } from "./entities/db-instances.entity";
import { internalDataSource } from "./internal-datasource";

export const getInternalDBInstancesRepository = async () => {
    if (!internalDataSource.isInitialized) {
        await internalDataSource.initialize();
    }
    return internalDataSource.getRepository(DBInstancesEntity);
};

export const recordDbCreation = async (dbName: string) => {
    const repository = await getInternalDBInstancesRepository();
    const entity = repository.create({
        dbName,
        status: "ALIVE",
    });
    await repository.save(entity);
};
