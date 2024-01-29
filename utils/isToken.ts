export function isToken(token: string): boolean {
    const regex = /[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27}/;
    return regex.test(token);
}