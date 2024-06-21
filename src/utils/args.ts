import * as yargs from "yargs";

export const actions = [
    "generate",
    "migrate",
    "revert",
    "doctor",
    "sync",
] as const;
export const targets = ["platform", "tenant"] as const;
export type Action = (typeof actions)[number];
export type Target = (typeof targets)[number];

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
