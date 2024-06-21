import { platformDataSource, tenantDataSource } from "../sources";
import { DataSource } from "typeorm";
import { getTenantRepository, type Config, Logger } from "../utils";

export default async function revert(this: Config, target: string) {
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    switch (target) {
        case "provider":
            const logger = new Logger("Provider");
            logger.log("Reverting last migration");
            await providerConnection.undoLastMigration();
            logger.log("Revert done");
            process.exit(0);
        case "consumer":
            const tenantsRepo = getTenantRepository.call(
                this,
                providerConnection
            );
            const tenants = await tenantsRepo.find();
            const consumerConnection = await tenantDataSource.then((x) =>
                x.initialize()
            );
            console.log(`Found ${tenants.length} clients`);
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
                const logger = new Logger(`Consumer: ${db.options.database}`);
                logger.log("Reverting last migration");
                const connection = await db.initialize();
                await connection.undoLastMigration();
                logger.log("Revert done");
            }
            process.exit(0);
        default:
            throw new Error("Invalid target");
    }
}
