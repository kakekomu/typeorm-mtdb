#!/usr/bin/env node

import { generate, migrate, revert, doctor } from "./actions";
import { readConfig, parseArgs } from "./utils";

async function main() {
    const args = await parseArgs();

    const config = readConfig();
    const action = (() => {
        switch (args.action) {
            case "generate":
                return generate.bind(config);
            case "migrate":
                return migrate.bind(config);
            case "revert":
                return revert.bind(config);
            case "doctor":
                return doctor.bind(config);
            default:
                throw new Error("Invalid action");
        }
    })();
    action(args.target);
}

main();
