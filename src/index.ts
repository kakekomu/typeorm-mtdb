#!/usr/bin/env node

import {
    generate,
    migrate,
    revert,
    doctor,
    distribute,
    spawn,
} from "./actions";
import { readConfig, parseArgs } from "./utils";

async function main() {
    const args = await parseArgs();
    const config = readConfig();
    const action = (() => {
        switch (args._[0]) {
            case "generate":
                return generate.bind(config, args.target);
            case "migrate":
                return migrate.bind(config, args.target);
            case "revert":
                return revert.bind(config, args.target);
            case "doctor":
                return doctor.bind(config, args.target);
            case "spawn":
                return spawn.bind(config);
            case "distribute":
                return distribute.bind(config);
            default:
                throw new Error("Invalid action");
        }
    })();
    action();
}

main();
