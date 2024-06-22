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
import * as chalk from "chalk"

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
            const tenantMigrations = tenantMaster.migrations.reverse();
            logger.log("Migrations:", 1);
            const masterExecuted = await listExecutedMigrations(
                this,
                tenantMaster
            );
            tenantMigrations.forEach((x) => {
                const status = masterExecuted.includes(x.name)
                    ? chalk.green("done")
                    : chalk.blue("pending");
                logger.log(`${x.name}: ${status}`, 2);
            });
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
                const tenantExecuted = await listExecutedMigrations(
                    this,
                    connection
                );
                logger.log("Migrations:", 4);
                for (const migration of tenantMigrations) {
                    if (
                        masterExecuted.includes(migration.name) ||
                        tenantExecuted.includes(migration.name)
                    ) {
                        const waitingForDistribution =
                            !masterExecuted.includes(migration.name) ||
                            !tenantExecuted.includes(migration.name);
                        const status = waitingForDistribution
                            ? chalk.yellow("waiting for distribution")
                            : chalk.green("done");
                        logger.log(`${migration.name}: ${status}`, 5);
                    } else {
                        const pending = chalk.blue("pending");
                        logger.log(`${migration.name}: ${pending}`, 5);
                    }
                }
            }
            process.exit(0);
        default:
            throw new Error("Invalid target");
    }
}
