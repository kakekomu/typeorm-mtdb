import { readConfig } from ".";
import * as fs from "fs";
import { faker } from "@faker-js/faker";

describe("ReadConfig", () => {
    describe("readFromTs", () => {
        let platformDbName: string;
        let tenantDbName: string;
        let prefix: string;
        let migrationOutDir: string;
        let migrationDir: string;
        let entitiesDir: string;
        let migrationTableName: string;
        let tenantTable: string;
        let keyColumn: string;
        beforeEach(() => {
            jest.clearAllMocks();
            platformDbName = faker.string.uuid();
            tenantDbName = faker.string.uuid();
            prefix = faker.string.alpha(3) + "_";
            migrationOutDir = faker.string.uuid();
            migrationDir = faker.string.uuid();
            entitiesDir = faker.string.uuid();
            migrationTableName = faker.string.uuid();
            tenantTable = faker.string.uuid();
            keyColumn = faker.string.uuid();
            const ts = `
            import { MtdbConfig } from "./src";

            const config: MtdbConfig = {
                platform: {
                    database: '${platformDbName}',
                    migrations: ['${migrationDir}/migrations/provider/*.js'],
                    migrationOutDir: '${migrationOutDir}',
                    entities: ['${entitiesDir}/entities/provider/*.js'],
                },
                tenant: {
                    classDbName: '${tenantDbName}',
                    prefix: '${prefix}',
                    migrations: ['${migrationDir}/migrations/consumer/*.js'],
                    migrationOutDir: '${migrationOutDir}',
                    entities: ['${entitiesDir}/entities/consumer/*.js'],
                },
                common: {
                    migrationTableName: '${migrationTableName}',
                },
                relation: {
                    tenantTable: '${tenantTable}',
                    keyColumn: '${keyColumn}',
                },
            };

            export default config;
            `;
            jest.spyOn(fs, "readFileSync").mockReturnValue(ts);
        });

        it("should read the config", async () => {
            const config = await readConfig();
            expect(config).toBeDefined();
        });

        it("should return correct platform db name", async () => {
            const config = await readConfig();
            expect(config.platform.database).toStrictEqual(platformDbName);
        });

        it("should return correct tenant db name", async () => {
            const config = await readConfig();
            expect(config.tenant.classDbName).toStrictEqual(tenantDbName);
        });

        it("should return correct prefix", async () => {
            const config = await readConfig();
            expect(config.tenant.prefix).toStrictEqual(prefix);
        });

        it("should return correct migration out dir", async () => {
            const config = await readConfig();
            expect(config.platform.migrationOutDir).toStrictEqual(
                migrationOutDir
            );
        });

        it("should return correct migration dir", async () => {
            const config = await readConfig();
            expect(config.platform.migrations).toStrictEqual([
                migrationDir + "/migrations/provider/*.js",
            ]);
        });

        it("should return correct entities dir", async () => {
            const config = await readConfig();
            expect(config.platform.entities).toStrictEqual([
                entitiesDir + "/entities/provider/*.js",
            ]);
        });

        it("should return correct migration table name", async () => {
            const config = await readConfig();
            expect(config.common.migrationTableName).toStrictEqual(
                migrationTableName
            );
        });

        it("should return correct tenant table name", async () => {
            const config = await readConfig();
            expect(config.relation.tenantTable).toStrictEqual(tenantTable);
        });

        it("should return correct key column", async () => {
            const config = await readConfig();
            expect(config.relation.keyColumn).toStrictEqual(keyColumn);
        });
    });

    describe("readFromJson", () => {
        let json: string;
        let platformDbName: string;
        let tenantDbName: string;
        let prefix: string;
        let migrationOutDir: string;
        let migrationDir: string;
        let entitiesDir: string;
        let migrationTableName: string;
        let tenantTable: string;
        let keyColumn: string;
        beforeEach(() => {
            jest.clearAllMocks();
            platformDbName = faker.string.uuid();
            tenantDbName = faker.string.uuid();
            prefix = faker.string.alpha(3) + "_";
            migrationOutDir = faker.string.uuid();
            migrationDir = faker.string.uuid();
            entitiesDir = faker.string.uuid();
            migrationTableName = faker.string.uuid();
            tenantTable = faker.string.uuid();
            keyColumn = faker.string.uuid();
            json = `
            {
                "platform": {
                    "database": "${platformDbName}",
                    "migrations": ["${migrationDir}/migrations/provider/*.js"],
                    "migrationOutDir": "${migrationOutDir}",
                    "entities": ["${entitiesDir}/entities/provider/*.js"]
                },
                "tenant": {
                    "classDbName": "${tenantDbName}",
                    "prefix": "${prefix}",
                    "migrations": ["${migrationDir}/migrations/consumer/*.js"],
                    "migrationOutDir": "${migrationOutDir}",
                    "entities": ["${entitiesDir}/entities/consumer/*.js"]
                },
                "common": {
                    "migrationTableName": "${migrationTableName}"
                },
                "relation": {
                    "tenantTable": "${tenantTable}",
                    "keyColumn": "${keyColumn}"
                }
            }
            `;
            jest.spyOn(fs, "readFileSync").mockReturnValue(json);
            // force to read json file
            jest.spyOn(fs, "existsSync").mockImplementation((path) => {
                if ((path as string).endsWith("ts")) {
                    return false;
                } else {
                    return true;
                }
            });
        });

        it("should read the config", async () => {
            const config = await readConfig();
            expect(config).toBeDefined();
        });

        it("should return correct platform db name", async () => {
            const config = await readConfig();
            expect(config.platform.database).toStrictEqual(platformDbName);
        });

        it("should return correct tenant db name", async () => {
            const config = await readConfig();
            expect(config.tenant.classDbName).toStrictEqual(tenantDbName);
        });

        it("should return correct prefix", async () => {
            const config = await readConfig();
            expect(config.tenant.prefix).toStrictEqual(prefix);
        });

        it("should return correct migration out dir", async () => {
            const config = await readConfig();
            expect(config.platform.migrationOutDir).toStrictEqual(
                migrationOutDir
            );
        });

        it("should return correct migration dir", async () => {
            const config = await readConfig();
            expect(config.platform.migrations).toStrictEqual([
                migrationDir + "/migrations/provider/*.js",
            ]);
        });

        it("should return correct platform entities dir", async () => {
            const config = await readConfig();
            expect(config.platform.entities).toStrictEqual([
                entitiesDir + "/entities/provider/*.js",
            ]);
        });

        it("should return correct tenant entities dir", async () => {
            const config = await readConfig();
            expect(config.tenant.entities).toStrictEqual([
                entitiesDir + "/entities/consumer/*.js",
            ]);
        });

        it("should return correct common migration table name", async () => {
            const config = await readConfig();
            expect(config.common.migrationTableName).toStrictEqual(
                migrationTableName
            );
        });

        it("should return correct relation tenant table", async () => {
            const config = await readConfig();
            expect(config.relation.tenantTable).toStrictEqual(tenantTable);
        });

        it("should return correct relation key column", async () => {
            const config = await readConfig();
            expect(config.relation.keyColumn).toStrictEqual(keyColumn);
        });
    });

    it("should throw error if config file not found", async () => {
        jest.spyOn(fs, "existsSync").mockReturnValue(false);
        await expect(readConfig()).rejects.toThrow("Config file not found");
    });
});
