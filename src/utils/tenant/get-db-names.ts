import { DataSource } from "typeorm";
import { Config } from "../readconfig";
import getTenantRepository from "./get-repository";

/** get tenant repositories */
export default async function (config: Config, platformConnection: DataSource) {
    const repo = getTenantRepository(config, platformConnection);
    const rows = await repo.find();
    return rows.map((row: any) => {
        const prefix = config.tenant.prefix;
        const dbName = `${prefix}${row[config.relation.keyColumn]}`;
        return dbName;
    });
}
