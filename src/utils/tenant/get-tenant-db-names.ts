import { DataSource } from "typeorm";
import { Config } from "../readconfig";
import { buildTenantDbName } from "../tenant"
import getTenantRepository from "./get-repository";

/** get tenant repositories */
export default async function (config: Config, platformConnection: DataSource) {
    const repo = getTenantRepository(config, platformConnection);
    const rows = await repo.find();
    const buildName = (row: any) => buildTenantDbName(config, row);
    return rows.map(buildName);
}
