import { execSync } from "child_process";
import { Config } from "../utils";

export default async function generate(this: Config, target: string) {
    switch (target) {
        case "tenant":
            if (!this.tenant.migration.dir) {
                throw new Error("Tenant migration directory not found");
            }
            execSync(
                `./node_modules/typeorm/cli.js migration:generate ${this.tenant.migration.dir} -d dist/src/typeorm-cli/sources/consumer.js`,
                {
                    stdio: "inherit",
                    env: process.env,
                }
            );
            break;
        case "platform":
            if (!this.platform.migration.dir) {
                throw new Error("Platform migration directory not found");
            }
            execSync(
                `./node_modules/typeorm/cli.js migration:generate ${this.platform.migration.dir} -d dist/sources/provider.js`,
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
