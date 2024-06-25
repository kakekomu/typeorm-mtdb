import { Config } from "..";

export default function (config: Config, tenantRow:any) {
    const prefix = config.tenant.prefix;
    const dbName = `${prefix}${tenantRow[config.relation.keyColumn]}`;
    return dbName;
}
