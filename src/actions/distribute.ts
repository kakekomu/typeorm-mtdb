import {
    Config,
    Logger,
    Target,
    getTenantDataSource,
    getTenantDbNames,
    listExecutedMigrations,
} from "../utils";
import { platformDataSource, tenantDataSource } from "../sources";
import { checkDatabase } from "typeorm-extension";

export default async function (this: Config, target: Target) {
    const logger = new Logger("Distribute");
    logger.log("Distributing to tenant schemas");
    const providerConnection = await platformDataSource.then((x) =>
        x.initialize()
    );
    const tenantConnection = await tenantDataSource.then((x) => x.initialize());
    const executedInMaster = await listExecutedMigrations(
        this,
        tenantConnection
    );
    const repo = await getTenantDbNames(this, providerConnection);
    let created = 0;
    for await (const dbName of repo) {
        const logger = new Logger(`Distribute.${dbName}`);
        const source = await getTenantDataSource(this, dbName);
        const { exists } = await checkDatabase({ options: source.options });
        if (exists) {
            const connection = await source.initialize();
            const executedMigrations = await listExecutedMigrations(
                this,
                connection
            );
            const actions = connection.migrations
                .reverse()
                .map((x) => {
                    if (
                        executedInMaster.includes(x.name) &&
                        !executedMigrations.includes(x.name)
                    ) {
                        return {
                            migration: x,
                            nextAction: "run",
                        };
                    } else if (
                        !executedInMaster.includes(x.name) &&
                        executedMigrations.includes(x.name)
                    ) {
                        return {
                            migration: x,
                            nextAction: "revert",
                        };
                    }
                })
                .filter(Boolean);
            const runner = connection.createQueryRunner();
            for await (const { migration, nextAction } of actions) {
                logger.log(`Migration ${migration.name} ${nextAction}`);
                if (nextAction === "run") {
                    await migration.up(runner);
                    await connection
                        .createQueryBuilder()
                        .insert()
                        .into(this.common.migrationTableName)
                        .values({
                            name: migration.name,
                            timestamp: new Date().getTime(),
                        })
                        .execute();
                } else {
                    await migration.down(runner);
                    await connection
                        .createQueryBuilder()
                        .delete()
                        .from(this.common.migrationTableName)
                        .where("name = :name", { name: migration.name })
                        .execute();
                }
            }
        }
    }
    process.exit(0);
}
