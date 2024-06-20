import { config } from 'dotenv';
import { generate } from './actions/generate';
import { migrate } from './actions/migrate';
import revert from './actions/revert';
import doctor from './actions/doctor';
import { rmdir, rmdirSync } from 'fs';

const targets = ['consumer', 'provider', 'revert', 'doctor'] as const;
type Target = (typeof targets)[number];

async function main() {
    // rmdirSync('./dist/_database/migrations', { recursive: true });
    if (process.argv.length < 4) {
        console.error('Usage: yarn db <action> <target>');
        console.error('action: generate | migrate');
        console.error('target: consumer | provider');
        process.exit(1);
    }
    const [, , actionInput, targetInput] = process.argv;
    if (!targets.includes(targetInput as Target)) {
        console.error('Invalid target');
        process.exit(1);
    }
    const target = targetInput as Target;
    config();
    const action = (() => {
        switch (actionInput) {
            case 'generate':
                return generate;
            case 'migrate':
                return migrate;
            case 'revert':
                return revert;
            case 'doctor':
                return doctor;
            default:
                throw new Error('Invalid action');
        }
    })();
    action(target);
}

main();
