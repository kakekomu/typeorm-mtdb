import { platformDataSource, tenantDataSource } from "../sources";
import { Logger, Target, getTenantRepository, type Config } from "../utils";

export default async function (this: Config, target: Target) {
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    switch (target) {
        case "platform":
            const logger = new Logger("Provider");
            logger.log("Reverting last migration");
            await providerConnection.undoLastMigration();
            logger.log("Revert done");
            await providerConnection.destroy();
            process.exit(0);
        case "tenant":
            const tenantsRepo = getTenantRepository(this, providerConnection);
            const tenants = await tenantsRepo.find();
            const consumerConnection = await tenantDataSource.then((x) =>
                x.initialize()
            );
            console.log(`Found ${tenants.length} clients`);
            const tenantLogger = new Logger(
                `Tenant: ${consumerConnection.options.database}`
            );
            tenantLogger.log("Reverting last migration");
            await consumerConnection.undoLastMigration();
            tenantLogger.log("Revert done");
            process.exit(0);
        default:
            throw new Error("Invalid target");
    }
}
