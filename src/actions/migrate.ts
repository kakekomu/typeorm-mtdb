import { platformDataSource, tenantDataSource } from "../sources";
import { DataSource } from "typeorm";
import { Logger, getTenantRepository, Config, Target } from "../utils";

export default async function migrate(this: Config, target: Target) {
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    switch (target) {
        case "tenant":
            const tenantsRepo = getTenantRepository(this, providerConnection);
            const tenants = await tenantsRepo.find();
            console.log(`Found ${tenants.length} clients`);
            const consumerConnection = await tenantDataSource.then((x) =>
                x.initialize()
            );
            const dbs = [
                consumerConnection,
                ...tenants.map((x) => {
                    const options: any = consumerConnection.options;
                    return new DataSource({
                        ...options,
                        database: `02_${x.id}`,
                    });
                }),
            ];
            for await (const db of dbs) {
                const logger = new Logger(`Tenant: ${db.options.database}`);
                logger.log("Migration start");
                const connection = await db.initialize();
                const hasPendingMigration = await connection.showMigrations();
                if (hasPendingMigration) {
                    logger.log("Pending migration found");
                    await connection.runMigrations();
                } else {
                    logger.log("No pending migration");
                }
                logger.log("Migration done");
            }
            process.exit(0);
        case "platform":
            const logger = new Logger("Platform");
            logger.log("Migration start");
            const hasPendingMigration =
                await providerConnection.showMigrations();
            if (hasPendingMigration) {
                logger.log("Pending migration found");
                await providerConnection.runMigrations();
            } else {
                logger.log("No pending migration");
            }
            logger.log("Migration done");
            process.exit(0);
        default:
            throw new Error("Invalid target");
    }
}
