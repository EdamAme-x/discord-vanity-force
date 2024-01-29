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

Logger.log("info", "MODE", `1. Safe Mode | 2. Fast Mode (Unsafe) | 3. Logging Mode (.2 Base)`);

const mode = prompt("Mode : ") ?? "1";

if (mode !== "1" && mode !== "2" && mode !== "3") {
    Logger.log("error", "ERROR", "Invalid mode");
    Deno.exit(1);
}

Logger.log("info", "INFO", "Start mode : " + (mode === "1" ? "Safe Mode" : "Fast Mode") + " | Exit with CTRL + C");

const cachedCode = new Set<string>();

let file: any;

if (mode === "3") {
    const logFileName = (Date.now() - 1).toString() + ".log";
    Logger.log("info", "INFO", `Logging to ./logs/${logFileName}`);

    if (!Deno.statSync("./logs")) {
        Deno.mkdirSync("./logs");
    }

    file = await Deno.open("./logs/" + logFileName, { write: true, create: true, truncate: true, read: true });
}

const processCode = async () => {
    const code = genString(length);
    if (cachedCode.has(code)) {
        processCode();
        return;
    }
    cachedCode.add(code);
    const res = await isExistVanity(code, token);
    if (res === "exist") {
        Logger.log("info", "INFO", `Code: ${code} | Exist`);
    } else if (res === "not_exist") {
        Logger.log("info", "INFO", `Code: ${code} | Not Exist`);
        if (mode === "1") {
            prompt("Press enter to continue...");
        } else if (mode === "3") {
            file.writeSync(new TextEncoder().encode(`Code: ${code} | Not Exist\n`));
        }
    } else if (res === "rate_limit") {
        Logger.log("warn", "WARN", `Rate Limit`);
        Logger.log("info", "INFO", `Sleep 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
    processCode();
};

if (mode === "1") {
    await processCode();
} else if (mode === "2" || mode === "3") {
    const concurrency = 5;
    const promises = [];
    for (let i = 0; i < concurrency; i++) {
        promises.push(processCode());
    }
    await Promise.all(promises);
}
