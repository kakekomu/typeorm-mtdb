import { DataSource } from "typeorm";
import { Config } from "../";

export default async function (
    config: Config,
    connection: DataSource
): Promise<string[]> {
    const names = await connection
        .createQueryBuilder()
        .select("name")
        .from(config.common.migrationTableName, "migrations")
        .execute();
    return names.map((x: any) => x.name);
}
