import { Config, Logger, Target, typeOrmCli } from "../utils";
import { join } from "path";

export default async function (this: Config, target: Target) {
    const logger = new Logger("Create");
    switch (target) {
        case "tenant":
            if (!this.tenant.migrationOutDir) {
                throw new Error("Tenant migration directory not found");
            }
            const output = typeOrmCli([
                "migration:create",
                join(this.tenant.migrationOutDir, "create"),
            ]);
            logger.log(output);
            break;
        case "platform":
            if (!this.platform.migrationOutDir) {
                throw new Error("Platform migration directory not found");
            }
            const output2 = typeOrmCli([
                "migration:create",
                join(this.platform.migrationOutDir, "create"),
            ]);
            logger.log(output2);
            break;
        default:
            throw new Error("Invalid target");
    }
}
