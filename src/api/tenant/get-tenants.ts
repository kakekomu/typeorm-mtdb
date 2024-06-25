import { buildTenantDbName, getTenantDataSource, readConfig } from "../../utils";
import { getTenantRepository } from "../";

/** list tenants */
export default async function (count = 10, offset = 0) {
    const repo = await getTenantRepository();
    const tenants = await repo.find({ take: count, skip: offset });
    const config = await readConfig();
    return Promise.all(
        tenants.map(async (x) => {
            const dbName = buildTenantDbName(config, x);
            const dataSource = await getTenantDataSource(config, dbName);
            return {
                tenant: x,
                dbName,
                dataSource,
            };
        })
    );
}
