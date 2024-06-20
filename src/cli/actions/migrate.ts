import providerSource from '../sources/provider';
import consumerSource from '../sources/consumer';
import { DataSource } from 'typeorm';
import Logger from '../logger';
import { getTenantEntity } from '../../utils/getTenant';

export async function migrate(target: string) {
    const providerConnection = await providerSource.initialize();
    switch (target) {
        case 'consumer':
            const clientRepo = providerConnection.getRepository(getTenantEntity());
            const clients = await clientRepo.find();
            console.log(`Found ${clients.length} clients`);
            const dbs = [
                consumerSource,
                ...clients.map((x) => {
                    const options: any = consumerSource.options;
                    return new DataSource({
                        ...options,
                        database: `02_${x.id}`,
                    });
                }),
            ];
            for await (const db of dbs) {
                const logger = new Logger(`Consumer: ${db.options.database}`);
                logger.log('Migration start');
                const connection = await db.initialize();
                const hasPendingMigration = await connection.showMigrations();
                if (hasPendingMigration) {
                    logger.log('Pending migration found');
                    await connection.runMigrations();
                } else {
                    logger.log('No pending migration');
                }
                logger.log('Migration done');
            }
            process.exit(0);
        case 'provider':
            const logger = new Logger('Provider');
            logger.log('Migration start');
            const hasPendingMigration =
                await providerConnection.showMigrations();
            if (hasPendingMigration) {
                logger.log('Pending migration found');
                await providerConnection.runMigrations();
            } else {
                logger.log('No pending migration');
            }
            logger.log('Migration done');
            process.exit(0);
        default:
            throw new Error('Invalid target');
    }
}
