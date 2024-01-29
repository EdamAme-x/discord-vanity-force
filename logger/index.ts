export class Logger {
    static log(type: "error" | "warn" | "info", title: string, message: string) {
        let color = "";

        switch (type) {
            case "error":
                color = Logger.errorColor;
                break;
            case "warn":
                color = Logger.warnColor;
                break;
            case "info":
                color = Logger.infoColor;
                break;
        }
        console.log(
            `[${Logger.getTimestamp()}] [${color}${title}\x1b[0m] ${message}`
        )
    }

    static errorColor = "\x1b[31m";
    static warnColor = "\x1b[33m";
    static infoColor = "\x1b[32m";
    static getTimestamp = () => new Date().toLocaleTimeString();
}