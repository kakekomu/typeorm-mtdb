#!/usr/bin/env node

import {
    generate,
    migrate,
    revert,
    doctor,
    distribute,
    spawn,
    create,
    init,
    reset,
} from "./actions";
import { readConfig, parseArgs } from "./utils";

async function main() {
    const { args, definition } = await parseArgs();
    const config = await readConfig();
    const action = (() => {
        switch (args._[0]) {
            case "init":
                return init(config);
            case "generate":
                return generate(config, args.target as "platform" | "tenant");
            case "migrate":
                return migrate(config, args.target as "platform" | "tenant");
            case "revert":
                return revert(config, args.target as "platform" | "tenant");
            case "doctor":
                return doctor(config, args.target as "platform" | "tenant");
            case "create":
                return create(config, args.target as "platform" | "tenant");
            case "spawn":
                return spawn(config);
            case "distribute":
                return distribute(config);
            case "reset":
                return reset(config);
            default:
                definition.showHelp();
                return;
        }
    })();
    await action;
}

main();
