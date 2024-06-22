import { DataSource } from "typeorm";
import { readConfig, parseArgs, arraySafe } from "../utils";

async function buildTenantDataSource() {
    await parseArgs();
    const config = readConfig();
    return new DataSource({
        name: config.tenant.masterDbName,
        type: "mysql",
        host: process.env.DB_HOST_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: config.tenant.masterDbName,
        migrations: arraySafe(config.tenant.migrations),
        entities: arraySafe(config.tenant.entities),
        migrationsTableName: "typeorm_migrations",
        migrationsTransactionMode: "all",
    });
}

export default buildTenantDataSource();
