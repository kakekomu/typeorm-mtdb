import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import Logger from './utils/logger';
import { execSync } from 'child_process';

async function transpileTs() {
    const cwd = process.cwd();
    const migrationDir = join(cwd, 'dist/src/_database/migrations');
    const entityDir = join(cwd, 'dist/src/_database/entities');

    const logger = new Logger('TypeScript: DB');
    logger.log(`Cleaning migrations directory: ${migrationDir}`);
    if (existsSync(migrationDir)) {
        rmSync(migrationDir, { recursive: true });
    }

    logger.log(`Cleaning entities directory: ${entityDir}`);
    if (existsSync(entityDir)) {
        rmSync(entityDir, { recursive: true });
    }

    logger.log('Transpiling TypeScript files');
    execSync('yarn tsc');
    logger.log('Transpilation done');    
    process.exit(0);
}

transpileTs();
