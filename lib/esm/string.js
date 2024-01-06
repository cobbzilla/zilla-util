export const capitalize = (s) => s && s.length > 0 ? s.substring(0, 1).toUpperCase() + s.substring(1) : "";
export const uncapitalize = (s) => s && s.length > 0 ? s.substring(0, 1).toLowerCase() + s.substring(1) : "";
export const basefilename = (s) => {
    if (!s)
        return s; // return null/undefined as-is
    // drop trailing slashes
    while (s.endsWith("/")) {
        s = s.substring(0, s.length - 1);
    }
    const i = s ? s.lastIndexOf("/") : -1;
    return i === -1 ? s : s.substring(i + 1);
};
export const basefilenameWithoutExt = (s) => {
    s = basefilename(s);
    if (!s)
        return s; // return null/undefined as-is
    // drop trailing dots
    while (s.endsWith(".")) {
        s = s.substring(0, s.length - 1);
    }
    const i = s ? s.lastIndexOf(".") : -1;
    return i === -1 ? s : s.substring(0, i);
};
export const dateAsYYYYMMDD = (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
export const dateAsYYYYMMDDHHmmSS = (date) => `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
    .getDate()
    .toString()
    .padStart(2, "0")}-${("" + date.getHours()).padStart(2, "0")}${("" + date.getMinutes()).padStart(2, "0")}${("" + date.getSeconds()).padStart(2, "0")}`;
export const timestampAsYYYYMMDD = (timestamp) => dateAsYYYYMMDD(new Date(timestamp));
export const timestampAsYYYYMMDDHHmmSS = (timestamp) => dateAsYYYYMMDDHHmmSS(new Date(timestamp));
export const sluggize = (name) => name.replace(/\s+/g, "_").replace(/\W+/g, "").replace(/_+/g, "_").toLowerCase();
const globalContext = typeof window === "object" ? window : globalThis;
export const uuidv4 = (squeezed) => {
    // Get random values
    const arr = new Uint8Array(16);
    globalContext.crypto.getRandomValues(arr);
    // Per 4.4, set bits for version and clock_seq_hi_and_reserved
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;
    // Join it all together
    const pad = (n) => (n.length < 2 ? "0" + n : n);
    const uuid = Array.from(arr)
        .map((b) => pad(b.toString(16)))
        .join("");
    return squeezed
        ? uuid
        : `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
};
//# sourceMappingURL=string.js.map