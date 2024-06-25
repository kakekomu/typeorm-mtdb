import { DataSource } from "typeorm";
import { Config } from "../readconfig";

/** get tenant repositories */
export default function (config: Config, platformConnection: DataSource) {
    const matched = platformConnection.entityMetadatas.find(
        (x) => x.tableName === config.relation.tenantTable
    );
    if (!matched) {
        return null;
    }
    const tenantsTable = platformConnection.getRepository(matched.target);
    return tenantsTable;
}
