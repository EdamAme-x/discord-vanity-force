const characters =
        "abcdefghijklmnopqrstuvwxyz0123456789";

export function genString(length: number) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}