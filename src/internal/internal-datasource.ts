import { DataSource } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { config } from "dotenv";
import { Create1726031797776 } from "./migrations/1726031797776-create-db-instances";
import { DBInstancesEntity } from "./entities/db-instances.entity";

config();

export const internalDataSourceOptions: MysqlConnectionOptions = {
    name: "internal",
    type: "mysql",
    host: process.env.DB_HOST_NAME,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: "mtdb_internal",
    entities: [DBInstancesEntity],
    migrations: [Create1726031797776],
    migrationsTableName: "migrations",
};

export const internalDataSource = new DataSource(internalDataSourceOptions);
