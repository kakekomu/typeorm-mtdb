import { DataSource } from "typeorm";
import { parseArgs } from "../utils";

async function buildTenantDataSource() {
    await parseArgs();
    return new DataSource({
        name: "default",
        type: "mysql",
        host: process.env.DB_HOST_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

export default buildTenantDataSource();
