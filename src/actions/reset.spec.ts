import { testConfig } from "../test-utils/test-config";
// import * as utils from "../utils";
import { DataSource } from "typeorm";
import { init, migrate, spawn } from ".";
import platformDataSourcePromise from "../sources/platform";
import tenantDataSourcePromise from "../sources/tenant";
import { getTenantRepository } from "../utils";
import reset from "./reset";

// Mock readConfig
jest.mock("../utils", () => {
    const original = jest.requireActual("../utils");
    return {
        ...original,
        readConfig: () => Promise.resolve(testConfig),
    };
});

describe("reset", () => {
    const config = testConfig;
    let platformDataSource: DataSource;
    let tenantDataSource: DataSource;
    // const mockedInit = jest.mocked(init);
    beforeEach(async () => {
        jest.clearAllMocks();
        jest.spyOn(process, "exit").mockImplementation((code) => {
            throw new Error(`Process exit with code ${code}`);
        });

        platformDataSource = await platformDataSourcePromise;
        tenantDataSource = await tenantDataSourcePromise;
    });

    describe("When initialized only", () => {
        beforeEach(async () => {
            await init(config).catch(() => {});
        });

        it("success", async () => {
            const action = reset(config);
            await expect(action).rejects.toThrow("Process exit with code 0");
        });
    });

    describe("When platform migrated", () => {
        beforeEach(async () => {
            await init(config).catch(() => {});
            await migrate(config, "platform").catch(() => {});
            console.log("platform migrated");
        });

        it("success", async () => {
            const action = reset(config);
            await expect(action).rejects.toThrow("Process exit with code 0");
            expect(true).toBeTruthy();
        });
    });

    describe("When tenant migrated", () => {
        beforeEach(async () => {
            await init(config).catch(() => {});
            await migrate(config, "platform").catch(() => {});
            await migrate(config, "tenant").catch(() => {});
            console.log("tenant migrated");
        });

        it("success", async () => {
            const action = reset(config);
            await expect(action).rejects.toThrow("Process exit with code 0");
        });
    });

    describe("When tenant exists", () => {
        beforeEach(async () => {
            await init(config).catch(() => {});
            await migrate(config, "platform").catch(() => {});
            await migrate(config, "tenant").catch(() => {});
            const repo = getTenantRepository(config, platformDataSource);
            if (!repo) {
                throw new Error("tenant repository not found");
            }
            const tenants = [
                repo.create({
                    name: "test",
                    email: "test@example.com",
                }),
                repo.create({
                    name: "test2",
                    email: "test2@example.com",
                }),
            ];
            await repo.save(tenants);
            await spawn(config).catch(() => {});
        });

        it("success", async () => {
            const action = reset(config);
            await expect(action).rejects.toThrow("Process exit with code 0");
        });
    });

    describe("When nothing exists", () => {
        it("success", async () => {
            const action = reset(config);
            await expect(action).rejects.toThrow("Process exit with code 0");
        });
    });
});
