import { execFileSync, execSync } from "child_process";
import { Config, Target } from "../utils";
import yargs from "yargs";

export default async function (this: Config, target: Target) {
    switch (target) {
        case "tenant":
            if (!this.tenant.migrationOutDir) {
                throw new Error("Tenant migration directory not found");
            }
            execFileSync(
                `./node_modules/.bin/typeorm`,
                [
                    "migration:generate",
                    `${this.platform.migrationOutDir}/test`,
                    `--dataSource`,
                    `dist/sources/tenant.js`,
                ],
                {
                    stdio: "inherit",
                    env: process.env,
                }
            );
            break;
        case "platform":
            if (!this.platform.migrationOutDir) {
                throw new Error("Platform migration directory not found");
            }
            execFileSync(
                `./node_modules/.bin/typeorm`,
                [
                    "migration:generate",
                    `${this.platform.migrationOutDir}/test`,
                    `--dataSource`,
                    `dist/sources/platform.js`,
                ],
                {
                    stdio: "inherit",
                    env: process.env,
                }
            );
            break;
        default:
            throw new Error("Invalid target");
    }
}
