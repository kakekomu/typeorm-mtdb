import { DataSourceOptions } from "typeorm";
import { checkDatabase, createDatabase } from "typeorm-extension";
import { defaultDataSource } from "../sources";
import { Config, Logger } from "../utils";

export default async function (this: Config) {
    const logger = new Logger();
    logger.log("Initializing multitenant db...");
    const defaultConnection = await defaultDataSource.then((x) =>
        x.initialize()
    );
    const platformOptions = {
        ...defaultConnection.options,
        database: this.platform.database,
    } as DataSourceOptions;
    const tenantOptions = {
        ...defaultConnection.options,
        database: this.tenant.classDbName,
    } as DataSourceOptions;

    const { exists: platformExists } = await checkDatabase({
        options: platformOptions,
    });
    if (!platformExists) {
        logger.log("Creating platform db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: platformOptions,
        });
    }

    const { exists: tenantExists } = await checkDatabase({
        options: tenantOptions,
    });
    if (!tenantExists) {
        logger.log("Creating tenant db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: tenantOptions,
        });
    }
    logger.log("Multitenant db initialized.");
    process.exit(0);
}
