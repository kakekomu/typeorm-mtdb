import { readFileSync } from "fs";
import { join } from "path";

type MigrationConfig = {
    migrations: string[];
    migrationOutDir: string;
};

export type Config = {
    platform: {
        database: string;
        entities: string[];
        tenantEntity: string;
    } & MigrationConfig;
    tenant: {
        prefix: string;
        entities: string[];
        masterDbName: string;
    } & MigrationConfig;
    common: {
        migrationTableName: string;
    };
    relation: {
        tenantTable: string;
        keyColumn: string;
    };
};

export default function () {
    const configfilepath = join(process.cwd(), "mtdb.config.json");
    const file = readFileSync(configfilepath, "utf-8");
    const config = JSON.parse(file);
    return config as Config;
}
