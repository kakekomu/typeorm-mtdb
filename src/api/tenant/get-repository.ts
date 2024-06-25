import { Repository } from "typeorm";
import { platformDataSource } from "../../sources";
import { readConfig, getTenantRepository } from "../../utils";

/** Get tenant client */
export default async function <T = any>() {
    const platformConnection = await platformDataSource;
    const config = await readConfig();
    return getTenantRepository(config, platformConnection) as Repository<T>;
}
