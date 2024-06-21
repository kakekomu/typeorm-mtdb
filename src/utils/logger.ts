export default class Logger {
    private target: string;
    constructor(target?: string) {
        this.target = target;
    }
    log(message: string, indent=0) {
        const indention = "  ".repeat(indent);
        const target = this.target ? `[${this.target}] ` : "";
        console.log(`${indention}${target}${message}`);
    }
}
