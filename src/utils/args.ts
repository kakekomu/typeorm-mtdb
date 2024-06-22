import * as yargs from "yargs";
const { hideBin } = require("yargs/helpers");

export const actions = [
    "generate",
    "migrate",
    "revert",
    "doctor",
    "spawn",
    "distribute",
    "create",
] as const;
export const targets = ["platform", "tenant"] as const;
export type Action = (typeof actions)[number];
export type Target = (typeof targets)[number];

export default async function () {
    const args = yargs(hideBin(process.argv))
        .command(
            "generate <target>",
            "Generate migrations on target database",
            (yargs) =>
                yargs.positional("target", {
                    describe: "Database target to run action on",
                    type: "string",
                    choices: targets,
                })
        )
        .command(
            "migrate <target>",
            "Run migrations on target database",
            (yargs) =>
                yargs.positional("target", {
                    describe: "Database target to run action on",
                    type: "string",
                    choices: targets,
                })
        )
        .command(
            "revert <target>",
            "Revert migrations on target database",
            (yargs) =>
                yargs.positional("target", {
                    describe: "Database target to run action on",
                    type: "string",
                    choices: targets,
                })
        )
        .command(
            "doctor <target>",
            "Check the status of migrations on target database",
            (yargs) =>
                yargs.positional("target", {
                    describe: "Database target to run action on",
                    type: "string",
                    choices: targets,
                })
        )
        .command(
            "create <target>",
            "Create a new migration on target database",
            (yargs) =>
                yargs.positional("target", {
                    describe: "Database target to run action on",
                    type: "string",
                    choices: targets,
                })
        )
        .command("spawn", "Spawn a new tenant database")
        .command("distribute", "Distribute migrations to all tenant databases")
        .option("dev", {
            describe: "Run in development mode",
            type: "boolean",
            default: false,
        })
        .parseSync();

    const { config } = await import("dotenv");
    config();
    return args;
}
