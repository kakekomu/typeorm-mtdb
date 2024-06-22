import { platformDataSource, tenantDataSource } from "../sources";
import { DataSource, DataSourceOptions } from "typeorm";
import {
    Config,
    getTenantRepository,
    listExecutedMigrations,
    Logger,
    Target,
} from "../utils";
import { checkDatabase } from "typeorm-extension";

export default async function (this: Config, target: Target) {
    const platformConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    const logger = new Logger();
    switch (target) {
        case "platform":
            logger.log("Platform:");
            const metaDatas = platformConnection.entityMetadatas;
            logger.log("Entities:", 1);
            metaDatas
                .filter((x) => !x.isJunction)
                .forEach((x) => logger.log(`${x.name}:`, 2));
            logger.log("Migrations:", 1);
            const launchedMigrations: string[] = await listExecutedMigrations(
                this,
                platformConnection
            );
            platformConnection.migrations.forEach((x) => {
                const status = launchedMigrations.includes(x.name)
                    ? "done"
                    : "pending";
                logger.log(`${x.name}:`, 2);
                logger.log(`Status: ${status}`, 3);
            });
            console.log();
            process.exit(0);
        case "tenant":
            logger.log("Tenant:");
            const tenantMaster = await tenantDataSource.then((x) =>
                x.initialize()
            );
            const tenantMigrations = tenantMaster.migrations;
            const tenantsRepo = getTenantRepository(this, platformConnection);
            const tenants = await tenantsRepo.find();
            logger.log("Entities:", 1);
            tenantMaster.entityMetadatas
                .filter((x) => !x.isJunction)
                .forEach((x) => logger.log(`${x.name}:`, 2));
            logger.log("Tenants:", 1);
            logger.log(`Count: ${tenants.length}`, 2);
            logger.log("Tenant DB:", 2);
            for await (const tenant of tenants) {
                const tenantKey = tenant[this.relation.keyColumn];
                const dbName = this.tenant.prefix + tenantKey;
                logger.log(`'${dbName}':`, 3);
                const newOption = {
                    ...tenantMaster.options,
                    database: dbName,
                } as DataSourceOptions;
                const { exists } = await checkDatabase({
                    dataSource: new DataSource(newOption),
                });
                if (!exists) {
                    logger.log("Exists: false", 4);
                    continue;
                } else {
                    logger.log("Exists: true", 4);
                }
                const connection = await new DataSource(newOption).initialize();
                const executed = await listExecutedMigrations(this, connection);
                logger.log("Migrations:", 4);
                for (const migration of tenantMigrations) {
                    const status = executed.includes(migration.name)
                        ? "done"
                        : "pending";
                    logger.log(`${migration.name}:`, 5);
                    logger.log(`Status: ${status}`, 6);
                }
            }
            process.exit(0);
        default:
            throw new Error("Invalid target");
    }
}
