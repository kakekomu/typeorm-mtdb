import { checkDatabase, dropDatabase } from "typeorm-extension";
import platformDataSourcePromise from "../sources/platform";
import tenantDataSourcePromise from "../sources/tenant";
import {
    Config,
    Logger,
    getTenantDataSource,
    getTenantDbNames,
} from "../utils";

export default async function (config: Config) {
    const logger = new Logger("Reset");
    logger.log("Resetting all database");

    const platformDbName = config.platform.database;
    const platformDataSource = await platformDataSourcePromise;
    const tenantClassDataSource = await tenantDataSourcePromise;
    const tenantClassDbName = config.tenant.classDbName;

    const { exists: platformExists } = await checkDatabase({
        dataSource: platformDataSource,
        dataSourceCleanup: false,
    });

    if (!platformExists) {
        logger.log(`Platform database does not exist: ${platformDbName}`);
    } else {
        const tenantTableExists = await platformDataSource
            .createQueryRunner()
            .hasTable(config.relation.tenantTable);
        if (tenantTableExists) {
            logger.log(
                `Tenants exists: ${platformDbName}.${config.relation.tenantTable}`
            );
            const tenantDbNames = await getTenantDbNames(
                config,
                platformDataSource
            );
            for (const tenantDbName of tenantDbNames) {
                const tenantDataSource = await getTenantDataSource(
                    config,
                    tenantDbName
                );
                await dropDatabase({
                    options: tenantDataSource.options,
                });
                logger.log(`Tenant database dropped: ${tenantDbName}`);
            }
        } else {
            logger.log(`No tenants exists: ${platformDbName}`);
        }
    }

    // Reset tenant databases
    const { exists: tenantExists } = await checkDatabase({
        dataSource: tenantClassDataSource,
    });
    if (tenantExists) {
        logger.log(`Tenant database exists: ${tenantClassDbName}`);
        await dropDatabase({
            options: tenantClassDataSource.options,
        });
        logger.log(`Tenant database dropped: ${tenantClassDbName}`);
    } else {
        logger.log("Tenant database does not exist. Skip this step");
    }

    // Reset platform database
    if (platformExists) {
        logger.log(`Platform database exists: ${platformDbName}`);
        await dropDatabase({
            options: platformDataSource.options,
        });
        logger.log(`Platform database dropped: ${platformDbName}`);
    } else {
        logger.log(
            `Platform database does not exist: ${platformDbName}. Skip this step`
        );
    }

    logger.log("Database reset");

    if (platformDataSource.isInitialized) {
        await platformDataSource.destroy();
    }
    if (tenantClassDataSource.isInitialized) {
        await tenantClassDataSource.destroy();
    }
    process.exit(0);
}
