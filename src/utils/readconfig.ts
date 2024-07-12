import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createContext, runInContext } from "vm";
import { transpileModule } from "typescript";

type MaybeArray<T> = T | T[];
type MigrationConfig = {
    /** migration pattern */
    migrations: MaybeArray<string>;
    /** directory where migration written */
    migrationOutDir: string;
};

export type Config = {
    /** Setting about platform */
    platform: {
        /** databasename of platform */
        database: string;
        /** entity pattern */
        entities: MaybeArray<string>;
    } & MigrationConfig;
    tenant: {
        prefix: string;
        entities: MaybeArray<string>;
        classDbName: string;
    } & MigrationConfig;
    common: {
        migrationTableName: string;
    };
    relation: {
        tenantTable: string;
        keyColumn: string;
    };
};

async function readFromTs(configTs: string) {
    const { outputText: code } = transpileModule(
        readFileSync(configTs, "utf-8"),
        {}
    );

    // 実行コンテキストの作成
    const sandbox: any = { exports: {} };
    createContext(sandbox);

    // コードを実行
    runInContext(code, sandbox);

    // 実行結果の取得
    const config = sandbox.exports.default;
    return config as Config;
}

function readFromJson(configJson: string) {
    const file = readFileSync(configJson, "utf-8");
    const config = JSON.parse(file);
    return config as Config;
}

export default async function () {
    const configTsPath = join(process.cwd(), "mtdb.config.ts");
    const configJsonPath = join(process.cwd(), "mtdb.config.json");
    if (existsSync(configTsPath)) {
        return await readFromTs(configTsPath);
    } else if (existsSync(configJsonPath)) {
        return readFromJson(configJsonPath);
    } else {
        throw new Error("Config file not found");
    }
}
