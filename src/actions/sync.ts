import {
    Config,
    Logger,
    Target,
    getTenantDataSource,
    getTenantDbNames,
} from "../utils";
import { platformDataSource } from "../sources";
import { checkDatabase, createDatabase } from "typeorm-extension";

export default async function sync(this: Config, target: Target) {
    const logger = new Logger("Sync");
    logger.log("Generating tenant schema");
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    const repo = await getTenantDbNames(this, providerConnection);
    let created = 0
    for await (const dbName of repo) {
        const logger = new Logger(`Sync.${dbName}`);
        const source = await getTenantDataSource(this, dbName);
        const { exists } = await checkDatabase({ options: source.options });
        if (!exists) {
            logger.log(`Schema not existing, creating...`);
            await createDatabase({ options: source.options });
            logger.log(`Schema created`);
            created++
        }
    }
    logger.log(`Created ${created} schemas`);
    process.exit(0);
}
