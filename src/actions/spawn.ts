import { checkDatabase, createDatabase } from "typeorm-extension";
import { platformDataSource } from "../sources";
import {
    Config,
    Logger,
    Target,
    getTenantDataSource,
    getTenantDbNames,
} from "../utils";
import { recordDbCreation } from "../internal/get-internal-db-instances-repository";

export default async function (config: Config) {
    const logger = new Logger("Spawn");
    logger.log("Generating tenant schema");
    const providerConnection = await platformDataSource;
    if (!providerConnection.isInitialized) {
        await providerConnection.initialize();
    }
    const repo = await getTenantDbNames(config, providerConnection);
    let created = 0;
    for await (const dbName of repo) {
        const logger = new Logger(`Spawn.${dbName}`);
        const source = await getTenantDataSource(config, dbName);
        const { exists } = await checkDatabase({ options: source.options });
        if (!exists) {
            logger.log(`Schema not existing, creating...`);
            await createDatabase({
                ifNotExist: true,
                options: source.options,
                synchronize: false,
            });
            await recordDbCreation(dbName);
            logger.log(`Schema created`);
            created++;
        }
    }
    logger.log(`Created ${created} schemas`);
    process.exit(0);
}
