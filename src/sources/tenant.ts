import { DataSource } from "typeorm";
import { readConfig, parseArgs, arraySafe } from "../utils";

async function buildTenantDataSource() {
    await parseArgs();
    const config = readConfig();
    const migrations = (() => {
        if (config.tenant.migration.pattern?.length > 0) {
            return config.tenant.migration.pattern;
        } else if (config.tenant.migration.dir) {
            return [`${config.tenant.migration.dir}/**/*.js`];
        }
    })();
    return new DataSource({
        type: "mysql",
        host: process.env.DB_HOST_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: config.tenant.masterDbName,
        migrations: arraySafe(migrations),
        entities: arraySafe(config.tenant.entities),
        migrationsTableName: "typeorm_migrations",
        migrationsTransactionMode: "all",
    });
}

export default buildTenantDataSource();
