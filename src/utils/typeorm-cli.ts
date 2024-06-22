import { execFileSync } from "child_process";

export default function (args: string[]) {
    const typeormCliPath = "./node_modules/.bin/typeorm";
    if (!typeormCliPath) {
        throw new Error("TypeORM CLI not found");
    }
    const proc = execFileSync(typeormCliPath, args, {
        env: process.env,
    });
    return proc.toString()
}
