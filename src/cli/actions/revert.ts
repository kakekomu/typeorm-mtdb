import Logger from '../logger';
import providerSource from '../sources/provider';
import consumerSource from '../sources/consumer';
import { DataSource } from 'typeorm';
import { getTenantEntity } from '../../utils/getTenant';

export default async function revert(target: string) {
    const providerConnection = await providerSource.initialize();
    switch (target) {
        case 'provider':
            const logger = new Logger('Provider');
            logger.log('Reverting last migration');
            await providerConnection.undoLastMigration();
            logger.log('Revert done');
            process.exit(0);
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
                logger.log('Reverting last migration');
                const connection = await db.initialize();
                await connection.undoLastMigration();
                logger.log('Revert done');
            }
            process.exit(0);
        default:
            throw new Error('Invalid target');
    }
}
