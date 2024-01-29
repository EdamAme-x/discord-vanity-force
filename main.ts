import { Logger } from './logger/index.ts';
import { isToken } from './utils/isToken.ts';
import { genString } from './utils/genString.ts';
import { isExistVanity } from './request/index.ts';

Logger.log("info", "LOG", "Starting...");

const token = prompt("Token: ");
if (!token || !isToken(token)) {
    Logger.log("error", "ERROR", "No token provided");
    Deno.exit(1);
}

const length = parseInt(prompt("Vanity Length (enter to 2) : ") ?? "0");

if (isNaN(length) || length < 2) {
    Logger.log("error", "ERROR", "Invalid length");
    Deno.exit(1);
}

Logger.log("info", "INFO", "Start | Exit with CTRL + C");

const cachedCode = new Set<string>();

const callback = async (): Promise<void> => {

    const code = genString(length);

    if (cachedCode.has(code)) {
        await callback();
    }

    cachedCode.add(code);

    const res = await isExistVanity(code, token);

    if (res === "exist") {
        Logger.log("info", "INFO", `Code: ${code} | Exist`);
    } else if (res === "not_exist") {
        Logger.log("info", "INFO", `Code: ${code} | Not Exist`);
        prompt("Press enter to continue...");
    } else if (res === "rate_limit") {
        Logger.log("warn", "WARN", `Rate Limit`);
        Logger.log("info", "INFO", `Sleep 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
    await callback();
}

await callback();