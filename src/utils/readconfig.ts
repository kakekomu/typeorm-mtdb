import { readFileSync } from "fs";
import { join } from "path";

type MigrationConfig = {
    pattern: string[];
    dir: string;
    tableName: string;
};

export type Config = {
    platform: {
        database: string;
        migration: MigrationConfig;
        entities: string[];
        tenantEntity: string;
    };
    tenant: {
        prefix: string;
        migration: MigrationConfig;
        entities: string[];
        masterDbName: string;
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
