import { DataSource } from "typeorm";
import { readConfig, parseArgs, arraySafe } from "../utils";

async function buildPlatformDataSource() {
    await parseArgs();
    const config = await readConfig();
    return new DataSource({
        name: config.platform.database,
        type: "mysql",
        host: process.env.DB_HOST_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: config.platform.database,
        migrations: arraySafe(config.platform.migrations),
        entities: arraySafe(config.platform.entities),
        migrationsTableName: "typeorm_migrations",
        migrationsTransactionMode: "all",
    });
}

export default buildPlatformDataSource();
