import { DataSource } from "typeorm";
import { readConfig, parseArgs, arraySafe } from "../utils";

async function buildPlatformDataSource() {
    await parseArgs();
    const config = readConfig();
    const migrations = (() => {
        if (config.platform.migration.pattern?.length > 0) {
            return config.platform.migration.pattern;
        } else if (config.platform.migration.dir) {
            return [`${config.platform.migration.dir}/**/*.js`];
        }
    })();
    return new DataSource({
        type: "mysql",
        host: process.env.DB_HOST_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: config.platform.database,
        migrations: arraySafe(migrations),
        entities: arraySafe(config.platform.entities),
        migrationsTableName: "typeorm_migrations",
        migrationsTransactionMode: "all",
    });
}

export default buildPlatformDataSource();
