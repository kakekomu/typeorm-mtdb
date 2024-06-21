import { DataSource, Entity } from "typeorm";
import { Config } from "./readconfig";

export default function (this: Config, platformConnection: DataSource) {
    const { target } = platformConnection.entityMetadatas.find(
        (x) => x.tableName === this.relation.tenantTable
    );
    const tenantsTable = platformConnection.getRepository(target);
    return tenantsTable;
}
