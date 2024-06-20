import Logger from '../logger';
import providerSource from '../sources/provider';
import consumerSource from '../sources/consumer';
import { DataSource } from 'typeorm';

async function listExecutedMigrations(
    connection: DataSource,
): Promise<string[]> {
    const sql = `SELECT name FROM typeorm_migrations;`;
    const launchedMigrations: string[] = await connection
        .query(sql)
        .then((list) => list.map((x: any) => x.name));
    return launchedMigrations;
}

export default async function doctor(target: string) {
    const providerConnection = await providerSource.initialize();
    switch (target) {
        case 'provider':
            const logger = new Logger('Provider');
            logger.log('Listing all migrations');
            const launchedMigrations: string[] = await listExecutedMigrations(
                providerConnection,
            );
            const migs = providerConnection.migrations.map((x) => {
                return {
                    name: x.name,
                    status: launchedMigrations.includes(x.name)
                        ? 'done'
                        : 'pending',
                };
            });
            migs.forEach((x) => {
                logger.log(`${x.name} - ${x.status}`);
            })
            logger.log('Revert done');
            process.exit(0);
        case 'consumer':
            process.exit(0);
        default:
            throw new Error('Invalid target');
    }
}
