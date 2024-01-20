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
const generateRandomValues = (count) => {
    if (globalThis && globalThis.crypto && globalThis.crypto.getRandomValues) {
        return globalThis.crypto.getRandomValues(new Uint8Array(count));
    }
    else {
        const arr = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            arr[i] = (Math.random() * 256) | 0;
        }
        return arr;
    }
};
export const uuidv4 = (squeezed) => {
    const arr = generateRandomValues(16);
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
export const camel2kebab = (camelCaseString) => camelCaseString.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
export const camel2snake = (camelCaseString) => camelCaseString.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2").toLowerCase();
export const kebab2camel = (kebabCaseString) => kebabCaseString
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));
export const snake2camel = kebab2camel;
export const hasUpperCase = (str) => /[A-Z]/.test(str);
export const startsWithPrefix = (s, prefixes) => prefixes.some((prefix) => s.startsWith(prefix));
export const endsWithSuffix = (s, suffixes) => suffixes.some((suffix) => s.endsWith(suffix));
export const randomDigits = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
//# sourceMappingURL=string.js.map