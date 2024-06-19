import { ZillaClock } from "./time.js";

export const capitalize = (s: string): string =>
    s && s.length > 0 ? s.substring(0, 1).toUpperCase() + s.substring(1) : "";

export const uncapitalize = (s: string): string =>
    s && s.length > 0 ? s.substring(0, 1).toLowerCase() + s.substring(1) : "";

export const basefilename = (s: string): string => {
    if (!s) return s; // return null/undefined as-is

    // drop trailing slashes
    while (s.endsWith("/")) {
        s = s.substring(0, s.length - 1);
    }
    const i = s ? s.lastIndexOf("/") : -1;
    return i === -1 ? s : s.substring(i + 1);
};

export const ext = (s: string): string => {
    if (!s) return s; // return null/undefined/no-dot files as-is
    const dot = s.lastIndexOf(".");
    return dot === -1 || dot === s.length - 1 ? "" : s.substring(dot + 1);
};

export const basefilenameWithoutExt = (s: string): string => {
    s = basefilename(s);
    if (!s) return s; // return null/undefined as-is

    // drop trailing dots
    while (s.endsWith(".")) {
        s = s.substring(0, s.length - 1);
    }
    const i = s ? s.lastIndexOf(".") : -1;
    return i === -1 ? s : s.substring(0, i);
};

export const dateAsYYYYMMDD = (date: Date): string =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}`;

export const dateAsYYYYMMDDHHmmSS = (date: Date): string =>
    `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
        .getDate()
        .toString()
        .padStart(2, "0")}-${("" + date.getHours()).padStart(2, "0")}${("" + date.getMinutes()).padStart(2, "0")}${(
        "" + date.getSeconds()
    ).padStart(2, "0")}`;

export const timestampAsYYYYMMDD = (timestamp: number): string => dateAsYYYYMMDD(new Date(timestamp));
export const timestampAsYYYYMMDDHHmmSS = (timestamp: number): string => dateAsYYYYMMDDHHmmSS(new Date(timestamp));

export const nowAsYYYYMMDD = (): string => timestampAsYYYYMMDD(Date.now());
export const nowAsYYYYMMDDHHmmSS = (): string => timestampAsYYYYMMDDHHmmSS(Date.now());

export const sluggize = (name: string, replaceChar = "_"): string => {
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

export const hyphenate = (name: string): string => sluggize(name, "-");

const generateRandomValues = (count: number): Uint8Array => {
    if (globalThis && globalThis.crypto && globalThis.crypto.getRandomValues) {
        return globalThis.crypto.getRandomValues(new Uint8Array(count));
    } else {
        const arr = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            arr[i] = (Math.random() * 256) | 0;
        }
        return arr;
    }
};

export const uuidv4 = (squeezed?: boolean): string => {
    const arr = generateRandomValues(16);

    // Per 4.4, set bits for version and clock_seq_hi_and_reserved
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;

    // Join it all together
    const pad = (n: string) => (n.length < 2 ? "0" + n : n);
    const uuid = Array.from(arr)
        .map((b) => pad(b.toString(16)))
        .join("");

    return squeezed
        ? uuid
        : `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
};

export const camel2kebab = (camelCaseString: string): string =>
    camelCaseString.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

export const camel2snake = (camelCaseString: string): string =>
    camelCaseString.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2").toLowerCase();

export const kebab2camel = (kebabCaseString: string): string =>
    kebabCaseString
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));

export const snake2camel = kebab2camel;

export const hasUpperCase = (str: string): boolean => /[A-Z]/.test(str);

export const startsWithPrefix = (s: string, prefixes: string[]): boolean =>
    prefixes.some((prefix) => s.startsWith(prefix));

export const endsWithSuffix = (s: string, suffixes: string[]): boolean => suffixes.some((suffix) => s.endsWith(suffix));

export const randomDigit = (min?: number, max?: number): number => {
    min = typeof min === "number" && min >= 0 && ((max && min <= max) || typeof max !== "number") ? min : 0;
    max = typeof max === "number" && max <= 9 && max >= min ? max : 9;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomDigits = (n: number, min?: number, max?: number): string =>
    Array.from({ length: n }, () => `${randomDigit(min, max)}`).join("");

export const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const VOWEL_CHARS = "AEOIUaeoiu";
export const DIGIT_CHARS = "0123456789";
export const VOWEL_AND_DIGIT_CHARS = VOWEL_CHARS + DIGIT_CHARS;

// "safeToken" means safe in two ways:
// 1. It's web-safe, using only characters than can appear un-encoded in URLs
// 2. It's curse-word safe: if any run of 3 alphabetic chars contains vowel, the next char is a digit
export const randomSafeToken = (n: number): string => {
    let result = "";

    for (let i = 0; i < n; i++) {
        let newChar = BASE62_CHARS[Math.floor(Math.random() * BASE62_CHARS.length)];

        // If we have at least 3 characters and they're all alphabetic
        if (
            result.length >= 3 &&
            isNaN(Number(result.charAt(result.length - 1))) &&
            isNaN(Number(result.charAt(result.length - 2))) &&
            isNaN(Number(result.charAt(result.length - 3)))
        ) {
            // if at least one of the last 3 is a vowel
            const oneVowelLast3 =
                VOWEL_CHARS.includes(result.charAt(result.length - 1)) ||
                VOWEL_CHARS.includes(result.charAt(result.length - 2)) ||
                VOWEL_CHARS.includes(result.charAt(result.length - 3));

            if (oneVowelLast3) {
                // ensure next character is a vowel or a digit
                newChar = VOWEL_AND_DIGIT_CHARS[Math.floor(Math.random() * VOWEL_AND_DIGIT_CHARS.length)];
            }
        }

        result += newChar;
    }

    return result;
};

export const epochToHttpDate = (epoch?: number, clock?: ZillaClock): string =>
    new Date(epoch ? epoch : clock ? clock.now() : Date.now()).toUTCString();

export const sortWords = (words: string[], dict: string[]): string[] =>
    words.sort(
        (a: string, b: string) =>
            dict.indexOf(a) - dict.indexOf(b) || dict.length + words.indexOf(a) - (dict.length + words.indexOf(b))
    );

export const trimSpaces = (str: string): string => str.trim().replace(/\s+/g, " ");

export const trimNonalphanumeric = (str: string): string => str.replace(/[^a-zA-Z0-9]/g, "");

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

const createUnifiedRange = (ranges: number[][]): number[] => {
    const unifiedRange = [];
    for (const [start, end] of ranges) {
        for (let i = start; i <= end; i++) {
            unifiedRange.push(i);
        }
    }
    return unifiedRange;
};

const unifiedUnicodeRange = createUnifiedRange(commonUnicodeRanges);

export const getRandomCodePoint = (): number => {
    const randomIndex = Math.floor(Math.random() * unifiedUnicodeRange.length);
    return unifiedUnicodeRange[randomIndex];
};

export const generateRandomString = (length: number): string => {
    return Array.from({ length }, () => String.fromCodePoint(getRandomCodePoint())).join("");
};

export const sortObj = (o: Record<string, unknown>): Record<string, unknown> =>
    Object.keys(o)
        .sort()
        .reduce((acc, key) => {
            acc[key] =
                typeof o[key] === "object" && o[key] !== null && !Array.isArray(o[key])
                    ? sortObj(o[key] as Record<string, unknown>)
                    : o[key];
            return acc;
        }, {} as Record<string, unknown>);

export const sortedStringify = (obj: Record<string, unknown>): string => JSON.stringify(sortObj(obj));
