import { DataSource } from "typeorm";
import { readConfig } from "../../utils/readconfig";

const config = readConfig();

export default new DataSource({
    type: "mysql",
    host: process.env.DB_HOST_NAME,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: config.tenant.masterDbName,
    migrations: config.tenant.migrations,
    entities: config.tenant.entities,
    migrationsTableName: "typeorm_migrations",
    migrationsTransactionMode: "all",
});
