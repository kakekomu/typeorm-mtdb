import { DataSource } from "typeorm";
import { parseArgs } from "../utils";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

async function buildTenantDataSource() {
    await parseArgs();
    const options: MysqlConnectionOptions = {
        name: "default",
        type: "mysql",
        host: process.env.DB_HOST_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        migrationsTableName: "typeorm_migrations",
    };
    return options;
}

export default buildTenantDataSource();
