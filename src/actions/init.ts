import { DataSource } from "typeorm";
import { checkDatabase, createDatabase } from "typeorm-extension";
import { defaultDataSource } from "../sources";
import { Config, Logger } from "../utils";

export default async function (config: Config) {
    const logger = new Logger();
    logger.log("Initializing multitenant db...");
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
    }
    const tenant = await new DataSource(tenantOptions).initialize();
    logger.log("Multitenant db initialized.");
    await platform.destroy();
    await tenant.destroy();

    process.exit(0);
}
