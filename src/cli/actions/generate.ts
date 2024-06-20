import { execSync } from 'child_process';

export async function generate(target: string) {
    switch (target) {
        case 'consumer':
            execSync(
                `./node_modules/typeorm/cli.js migration:generate src/_database/migrations/consumer/generated -d dist/src/typeorm-cli/sources/consumer.js`,
                {
                    stdio: 'inherit',
                    env: process.env,
                },
            );
            break;
        case 'provider':
            execSync(
                `./node_modules/typeorm/cli.js migration:generate src/_database/migrations/provider/generated -d dist/src/typeorm-cli/sources/provider.js`,
                {
                    stdio: 'inherit',
                    env: process.env,
                },
            );
            break;
        default:
            throw new Error('Invalid target');
    }
}
