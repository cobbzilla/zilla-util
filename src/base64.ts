export const base64Encode = (str: string): string => {
    let utf8str = "";
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code < 0x80) {
            utf8str += String.fromCharCode(code);
        } else if (code < 0x800) {
            utf8str += String.fromCharCode(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            utf8str += String.fromCharCode(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            i++;
            const surrogatePair = 0x10000 + ((code & 0x3ff) << 10) + (str.charCodeAt(i) & 0x3ff);
            utf8str += String.fromCharCode(
                0xf0 | (surrogatePair >> 18),
                0x80 | ((surrogatePair >> 12) & 0x3f),
                0x80 | ((surrogatePair >> 6) & 0x3f),
                0x80 | (surrogatePair & 0x3f)
            );
        }
    }
    const base64 = btoa(utf8str);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const base64Decode = (base64: string): string => {
    const base64Str = base64.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64Str = base64Str.padEnd(base64Str.length + ((4 - (base64Str.length % 4)) % 4), "=");
    const utf8Str = atob(paddedBase64Str);
    let result = "";
    let i = 0;
    while (i < utf8Str.length) {
        const byte1 = utf8Str.charCodeAt(i++);
        if (byte1 < 0x80) {
            result += String.fromCharCode(byte1);
            continue;
        }
        const byte2 = utf8Str.charCodeAt(i++) & 0x3f;
        if (byte1 < 0xe0) {
            result += String.fromCharCode(((byte1 & 0x1f) << 6) | byte2);
            continue;
        }
        const byte3 = utf8Str.charCodeAt(i++) & 0x3f;
        if (byte1 < 0xf0) {
            result += String.fromCharCode(((byte1 & 0x0f) << 12) | (byte2 << 6) | byte3);
            continue;
        }
        const byte4 = utf8Str.charCodeAt(i++) & 0x3f;
        const codePoint = (((byte1 & 0x07) << 18) | (byte2 << 12) | (byte3 << 6) | byte4) - 0x10000;
        result += String.fromCharCode(0xd800 + (codePoint >> 10), 0xdc00 + (codePoint & 0x3ff));
    }
    return result;
};
