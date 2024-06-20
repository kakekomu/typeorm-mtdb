export default class Logger {
    private target: string;
    constructor(target: string) {
        this.target = target;
    }
    log(message: string) {
        console.log(`[${this.target}] ${message}`);
    }
}
