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
export const ext = (s) => {
    if (!s)
        return s; // return null/undefined/no-dot files as-is
    const dot = s.lastIndexOf(".");
    return dot === -1 || dot === s.length - 1 ? "" : s.substring(dot + 1);
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
export const dateAsUTCYYYYMMDD = (date) => `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date
    .getUTCDate()
    .toString()
    .padStart(2, "0")}`;
export const nextDateAsYYYYMMDD = (d) => {
    const dt = new Date(`${d}T00:00:00Z`); // UTC midnight of current day
    dt.setUTCDate(dt.getUTCDate() + 1); // +1 calendar day
    return dt.toISOString().slice(0, 10); // back to YYYY‑MM‑DD
};
export const dateAsYYYYMMDDHHmmSS = (date) => `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
    .getDate()
    .toString()
    .padStart(2, "0")}-${("" + date.getHours()).padStart(2, "0")}${("" + date.getMinutes()).padStart(2, "0")}${("" + date.getSeconds()).padStart(2, "0")}`;
export const timestampAsYYYYMMDD = (timestamp) => dateAsYYYYMMDD(new Date(timestamp));
export const timestampAsUTCYYYYMMDD = (timestamp) => dateAsUTCYYYYMMDD(new Date(timestamp));
export const timestampAsYYYYMMDDHHmmSS = (timestamp) => dateAsYYYYMMDDHHmmSS(new Date(timestamp));
export const nowAsYYYYMMDD = () => timestampAsYYYYMMDD(Date.now());
export const nowAsYYYYMMDDHHmmSS = () => timestampAsYYYYMMDDHHmmSS(Date.now());
export const sluggize = (name, replaceChar = "_") => {
    replaceChar ||= "_";
    return name
        .trim()
        .replace(new RegExp(`[^A-Z\\d${replaceChar}]+`, "gi"), replaceChar)
        .replace(/[\s_-]+/g, replaceChar)
        .replace(new RegExp(`[${replaceChar}]+`, "gi"), replaceChar)
        .replace(new RegExp(`^[${replaceChar}]+`, "gi"), "")
        .replace(new RegExp(`[${replaceChar}]+$`, "gi"), "")
        .toLowerCase();
};
export const hyphenate = (name) => sluggize(name, "-");
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
export const randomDigit = (min, max) => {
    min = typeof min === "number" && min >= 0 && ((max && min <= max) || typeof max !== "number") ? min : 0;
    max = typeof max === "number" && max <= 9 && max >= min ? max : 9;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const randomDigits = (n, min, max) => Array.from({ length: n }, () => `${randomDigit(min, max)}`).join("");
export const isOnlyDigits = (s) => /^\d+$/.test(s);
export const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const BASE62_CHARS_WITHOUT_SIMILAR_CHARS = "23456789ABCEFGHJKLMNPRSTUVWXYZ";
export const VOWEL_CHARS = "AEOIUaeoiu";
export const DIGIT_CHARS = "0123456789";
export const VOWEL_AND_DIGIT_CHARS = VOWEL_CHARS + DIGIT_CHARS;
// "safeToken" means safe in two ways:
// 1. It's web-safe, using only characters than can appear un-encoded in URLs
// 2. It's curse-word safe: after 2 consecutive letters, the next char will be a vowel or digit
export const _randomSafeToken = (n, CHARS) => {
    let result = "";
    const allowedSet = new Set(CHARS);
    const vowelsAndDigits = [...VOWEL_AND_DIGIT_CHARS].filter((char) => allowedSet.has(char)).join("");
    for (let i = 0; i < n; i++) {
        let newChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        // If we have at least 2 characters and they're all alphabetic
        if (result.length >= 2 &&
            isNaN(Number(result.charAt(result.length - 1))) &&
            isNaN(Number(result.charAt(result.length - 2)))) {
            // ensure next character is a vowel or a digit
            newChar = vowelsAndDigits[Math.floor(Math.random() * vowelsAndDigits.length)];
        }
        result += newChar;
    }
    return result;
};
export const randomSafeToken = (n) => _randomSafeToken(n, BASE62_CHARS);
export const randomSuperSafeToken = (n) => _randomSafeToken(n, BASE62_CHARS_WITHOUT_SIMILAR_CHARS);
export const epochToHttpDate = (epoch, clock) => new Date(epoch ? epoch : clock ? clock.now() : Date.now()).toUTCString();
export const sortWords = (words, dict) => words.sort((a, b) => dict.indexOf(a) - dict.indexOf(b) || dict.length + words.indexOf(a) - (dict.length + words.indexOf(b)));
export const trimSpaces = (str) => str.trim().replace(/\s+/g, " ");
export const trimNonalphanumeric = (str) => str.replace(/[^a-zA-Z0-9]/g, "");
const commonUnicodeRanges = [
    [0x0000, 0x007f], // Basic Latin (ASCII)
    [0x0080, 0x00ff], // Latin-1 Supplement
    [0x0100, 0x017f], // Latin Extended-A
    [0x0370, 0x03ff], // Greek and Coptic
    [0x0400, 0x04ff], // Cyrillic
    [0x0530, 0x058f], // Armenian
    [0x0590, 0x05ff], // Hebrew
    [0x0600, 0x06ff], // Arabic
    [0x0900, 0x097f], // Devanagari
    [0xac00, 0xd7af], // Hangul Syllables
    [0x4e00, 0x9fff], // CJK Unified Ideographs
];
const createUnifiedRange = (ranges) => {
    const unifiedRange = [];
    for (const [start, end] of ranges) {
        for (let i = start; i <= end; i++) {
            unifiedRange.push(i);
        }
    }
    return unifiedRange;
};
const unifiedUnicodeRange = createUnifiedRange(commonUnicodeRanges);
export const getRandomCodePoint = () => {
    const randomIndex = Math.floor(Math.random() * unifiedUnicodeRange.length);
    return unifiedUnicodeRange[randomIndex];
};
export const generateRandomString = (length) => {
    return Array.from({ length }, () => String.fromCodePoint(getRandomCodePoint())).join("");
};
export const sortObj = (o) => Object.keys(o)
    .sort()
    .reduce((acc, key) => {
    acc[key] =
        typeof o[key] === "object" && o[key] !== null && !Array.isArray(o[key])
            ? sortObj(o[key])
            : o[key];
    return acc;
}, {});
export const sortedStringify = (obj) => JSON.stringify(sortObj(obj));
export const jsonHeader = () => ({ "Content-Type": "application/json" });
export const ANSI = {
    RESET: "\x1b[0m",
    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    UNDERLINE: "\x1b[4m",
    BLINK: "\x1b[5m",
    INVERSE: "\x1b[7m",
    HIDDEN: "\x1b[8m",
    // Foreground Colors
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    // Bright Foreground Colors
    BRIGHT_BLACK: "\x1b[90m",
    BRIGHT_RED: "\x1b[91m",
    BRIGHT_GREEN: "\x1b[92m",
    BRIGHT_YELLOW: "\x1b[93m",
    BRIGHT_BLUE: "\x1b[94m",
    BRIGHT_MAGENTA: "\x1b[95m",
    BRIGHT_CYAN: "\x1b[96m",
    BRIGHT_WHITE: "\x1b[97m",
};
export const CSS = {
    RESET: "color: inherit;",
    BOLD: "font-weight: bold;",
    DIM: "opacity: 0.7;",
    UNDERLINE: "text-decoration: underline;",
    // for BLINK to work, add the CSS below to some global CSS file that the browser will load:
    // @keyframes blink { 50% { opacity: 0; } }
    // If the CSS isn't defined, BLINK text will still appear, it just won't blink
    BLINK: "animation: blink 1s step-start infinite;",
    INVERSE: "filter: invert(100%);",
    HIDDEN: "visibility: hidden;",
    // Foreground Colors
    BLACK: "color: black;",
    RED: "color: red;",
    GREEN: "color: green;",
    YELLOW: "color: goldenrod;",
    BLUE: "color: blue;",
    MAGENTA: "color: purple;",
    CYAN: "color: cyan;",
    WHITE: "color: white;",
    // Bright Foreground Colors
    BRIGHT_BLACK: "color: gray;",
    BRIGHT_RED: "color: lightcoral;",
    BRIGHT_GREEN: "color: lightgreen;",
    BRIGHT_YELLOW: "color: yellow;",
    BRIGHT_BLUE: "color: lightskyblue;",
    BRIGHT_MAGENTA: "color: violet;",
    BRIGHT_CYAN: "color: lightcyan;",
    BRIGHT_WHITE: "color: white;",
};
export const REGEX_ARRAY_OF_STRINGS = /^\[\s*(?:"[^"]*"\s*(?:,\s*"[^"]*"\s*)*)?]$/;
export const REGEX_ARRAY_OF_BOOLEANS = /^\[\s*(?:true|false)(\s*,\s*(?:true|false))*\s*]$/;
export const REGEX_ARRAY_OF_INTEGERS = /^\[\s*-?\d+(\s*,\s*-?\d+)*\s*]$/;
export const REGEX_ARRAY_OF_FLOATS = /^\[\s*-?\d+(\.\d+)?([eE][-+]?\d+)?(\s*,\s*-?\d+(\.\d+)?([eE][-+]?\d+)?)*\s*]$/;
//# sourceMappingURL=string.js.map