import { DataSource } from "typeorm";
import { checkDatabase, createDatabase } from "typeorm-extension";
import { defaultDataSource } from "../sources";
import { Config, Logger } from "../utils";
import {
    internalDataSource,
    internalDataSourceOptions,
} from "../internal/internal-datasource";
import { recordDbCreation } from "../internal/get-internal-db-instances-repository";

export default async function (config: Config) {
    const logger = new Logger();
    logger.log("Initializing multitenant db...");

    const { exists: internalExists } = await checkDatabase({
        dataSource: internalDataSource,
    });
    if (!internalExists) {
        logger.log("Creating internal db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: internalDataSourceOptions,
        });
        await recordDbCreation(internalDataSourceOptions.database);
    }
    if (!internalDataSource.isInitialized) {
        await internalDataSource.initialize();
    }

    await internalDataSource.runMigrations();
    logger.log("Internal db initialized.");

    const defaultOptions = await defaultDataSource;
    const platformOptions = {
        ...defaultOptions,
        database: config.platform.database,
    };
    const tenantOptions = {
        ...defaultOptions,
        database: config.tenant.classDbName,
    };

    const { exists: platformExists } = await checkDatabase({
        dataSource: new DataSource(platformOptions),
    });
    if (!platformExists) {
        logger.log("Creating platform db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: platformOptions,
        });
        await recordDbCreation(platformOptions.database);
        logger.log(`Platform db created: ${platformOptions.database}`);
    } else {
        logger.log(`Platform db already exists: ${platformOptions.database}`);
    }
    const platform = await new DataSource(platformOptions).initialize();

    const { exists: tenantExists } = await checkDatabase({
        dataSource: new DataSource(tenantOptions),
    });
    if (!tenantExists) {
        logger.log("Creating tenant db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: tenantOptions,
        });
        await recordDbCreation(tenantOptions.database);
        logger.log(`Tenant db created: ${tenantOptions.database}`);
    } else {
        logger.log(`Tenant db already exists: ${tenantOptions.database}`);
    }
    const tenant = await new DataSource(tenantOptions).initialize();
    logger.log("Multitenant db initialized.");
    // await internalDataSource.destroy();
    // await platform.destroy();
    // await tenant.destroy();

    process.exit(0);
}
