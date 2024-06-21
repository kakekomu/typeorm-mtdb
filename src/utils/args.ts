export const actions = ["generate", "migrate", "revert", "doctor"] as const;
export const targets = ["platform", "tenant"] as const;
import * as yargs from "yargs";

export default async function () {
    const args = yargs
        .command(
            "* <action> <target>",
            "Manage multi-tenant database migrations"
        )
        .positional("action", {
            describe: "action to run",
            type: "string",
            choices: actions,
        })
        .positional("target", {
            describe: "Database target to run action on",
            type: "string",
            choices: targets,
        })
        .option("dev", {
            describe: "Run in development mode",
            type: "boolean",
            default: false,
        })
        .parseSync();

    if (args.dev) {
        const { config } = await import("dotenv");
        config();
    }
    return args;
}
