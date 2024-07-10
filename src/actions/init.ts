import { Config, Logger } from "../utils";
import { checkDatabase, createDatabase } from "typeorm-extension";
import { platformDataSource, tenantDataSource } from "../sources";

export default async function (this: Config) {
    const logger = new Logger();
    logger.log("Initializing multitenant db...");
    const platformConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    const { exists: platformExists } = await checkDatabase({
        dataSource: platformConnection,
    });
    if (!platformExists) {
        logger.log("Creating platform db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: platformConnection.options,
        });
    }

    const tenantConnection = await tenantDataSource.then((x) => x.initialize());
    const { exists: tenantExists } = await checkDatabase({
        dataSource: tenantConnection,
    });
    if (!tenantExists) {
        logger.log("Creating tenant db...");
        await createDatabase({
            ifNotExist: true,
            synchronize: false,
            options: tenantConnection.options,
        });
    }
}
