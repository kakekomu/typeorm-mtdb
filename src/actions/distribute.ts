import { checkDatabase } from "typeorm-extension";
import { platformDataSource, tenantDataSource } from "../sources";
import {
    Config,
    Logger,
    getTenantDataSource,
    getTenantDbNames,
    listExecutedMigrations,
} from "../utils";
import * as chalk from "chalk";

export default async function (this: Config) {
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
    for await (const dbName of repo) {
        const logger = new Logger(`Distribute.${dbName}`);
        const source = await getTenantDataSource(this, dbName);
        const { exists } = await checkDatabase({ options: source.options });
        let modified = 0;
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
                            nextAction: "migrate",
                            chalk: chalk.green,
                        };
                    } else if (
                        !executedInMaster.includes(x.name) &&
                        executedMigrations.includes(x.name)
                    ) {
                        return {
                            migration: x,
                            nextAction: "revert",
                            chalk: chalk.red,
                        };
                    }
                })
                .filter(Boolean);
            const runner = connection.createQueryRunner();
            for await (const { migration, nextAction, chalk } of actions) {
                logger.log(`Migration ${migration.name} ${chalk(nextAction)}`);
                if (nextAction === "migrate") {
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
                modified++;
            }

            await runner.release();
            logger.log(`Modified: ${modified}`);
        }
    }
    process.exit(0);
}
