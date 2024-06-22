import { DataSource, DataSourceOptions } from "typeorm";
import { Config } from "../";
import { tenantDataSource } from "../../sources";

export default async function (config: Config, tenantDbName: string) {
    const def = await tenantDataSource;
    const newOption = {
        ...def.options,
        database: tenantDbName,
        name: tenantDbName,
    } as DataSourceOptions;
    return new DataSource(newOption);
}
