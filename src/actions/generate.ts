import { Config, Target, typeOrmCli } from "../utils";
import { join } from "path";

export default async function (config: Config, target: Target) {
    const sourcePath = (() => {
        const mtdb = require("typeorm-mtdb");
        if (mtdb) {
            return `node_modules/typeorm-mtdb/dist/sources`;
        } else {
            return `/dist/sources`;
        }
    })();
    switch (target) {
        case "tenant":
            if (!config.tenant.migrationOutDir) {
                throw new Error("Tenant migration directory not found");
            }
            typeOrmCli([
                "migration:generate",
                `${config.tenant.migrationOutDir}/generated`,
                `--dataSource`,
                join(sourcePath, `tenant.js`),
            ]);
            break;
        case "platform":
            if (!config.platform.migrationOutDir) {
                throw new Error("Platform migration directory not found");
            }
            typeOrmCli([
                "migration:generate",
                `${config.platform.migrationOutDir}/generated`,
                `--dataSource`,
                join(sourcePath, `platform.js`),
            ]);
            break;
        default:
            throw new Error("Invalid target");
    }
}
