import { Config, Logger, Target, typeOrmCli } from "../utils";
import { join } from "path";

export default async function (config: Config, target: Target) {
    const logger = new Logger("Create");
    switch (target) {
        case "tenant":
            if (!config.tenant.migrationOutDir) {
                throw new Error("Tenant migration directory not found");
            }
            const output = typeOrmCli([
                "migration:create",
                join(config.tenant.migrationOutDir, "create"),
            ]);
            logger.log(output);
            break;
        case "platform":
            if (!config.platform.migrationOutDir) {
                throw new Error("Platform migration directory not found");
            }
            const output2 = typeOrmCli([
                "migration:create",
                join(config.platform.migrationOutDir, "create"),
            ]);
            logger.log(output2);
            break;
        default:
            throw new Error("Invalid target");
    }
}
