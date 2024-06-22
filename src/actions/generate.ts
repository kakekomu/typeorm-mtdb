import { Config, Target, typeOrmCli } from "../utils";

export default async function (this: Config, target: Target) {
    switch (target) {
        case "tenant":
            if (!this.tenant.migrationOutDir) {
                throw new Error("Tenant migration directory not found");
            }
            typeOrmCli([
                "migration:generate",
                `${this.platform.migrationOutDir}/test`,
                `--dataSource`,
                `dist/sources/tenant.js`,
            ]);
            break;
        case "platform":
            if (!this.platform.migrationOutDir) {
                throw new Error("Platform migration directory not found");
            }
            typeOrmCli([
                "migration:generate",
                `${this.platform.migrationOutDir}/test`,
                `--dataSource`,
                `dist/sources/platform.js`,
            ]);
            break;
        default:
            throw new Error("Invalid target");
    }
}
