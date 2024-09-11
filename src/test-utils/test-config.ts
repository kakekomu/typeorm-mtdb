import { Config } from "../utils";

export const testConfig: Config = {
    platform: {
        database: "test_00_platform",
        migrations: ["dist/temp/migrations/provider/*.js"],
        migrationOutDir: "src/db/migrations/platform",
        entities: ["dist/temp/entities/provider/*.js"],
    },
    tenant: {
        classDbName: "test_01_consumer",
        prefix: "test_02_",
        migrations: ["dist/temp/migrations/consumer/*.js"],
        migrationOutDir: "src/_database/migrations/consumer",
        entities: ["dist/temp/entities/consumer/*.js"],
    },
    common: {
        migrationTableName: "typeorm_migrations",
    },
    relation: {
        tenantTable: "client",
        keyColumn: "id",
    },
};
