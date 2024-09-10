import { platformDataSource, tenantDataSource } from "../sources";
import { Config, Logger, Target, getTenantRepository } from "../utils";

export default async function (config: Config, target: Target) {
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    switch (target) {
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
            await providerConnection.destroy();
            logger.log("Migration done");
            process.exit(0);
        case "tenant":
            const tenantConnection = await tenantDataSource.then((x) =>
                x.initialize()
            );
            const tenantLogger = new Logger(
                `Tenant: ${tenantConnection.options.database}`
            );
            tenantLogger.log("Migration start");
            const tenantHasPendingMigration =
                await tenantConnection.showMigrations();
            if (tenantHasPendingMigration) {
                tenantLogger.log("Pending migration found");
                await tenantConnection.runMigrations();
            } else {
                tenantLogger.log("No pending migration");
            }
            tenantLogger.log("Migration done");
            process.exit(0);
        default:
            throw new Error("Invalid target");
    }
}
