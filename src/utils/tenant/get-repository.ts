import { DataSource } from "typeorm";
import { Config } from "../readconfig";

/** get tenant repositories */
export default function (config: Config, platformConnection: DataSource) {
    const { target } = platformConnection.entityMetadatas.find(
        (x) => x.tableName === config.relation.tenantTable
    );
    const tenantsTable = platformConnection.getRepository(target);
    return tenantsTable;
}
