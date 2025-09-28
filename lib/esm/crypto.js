// crypto-util.ts (browser-only, no Node APIs)
import { LRUCache } from "zilla-util";
export var CryptoParam;
(function (CryptoParam) {
    CryptoParam["RSA_MODULUS_LENGTH"] = "RSA_MODULUS_LENGTH";
    CryptoParam["RSA_PUBLIC_EXPONENT"] = "RSA_PUBLIC_EXPONENT";
    CryptoParam["OAEP_HASH"] = "OAEP_HASH";
})(CryptoParam || (CryptoParam = {}));
const DEFAULTS = {
    modulusLength: 3072,
    publicExponent: 65537,
    oaepHash: "sha256",
};
const ALLOWED_MODULUS = new Set([2048, 3072, 4096]);
const ALLOWED_EXPONENTS = new Set([65537]);
const ALLOWED_HASHES = new Set(["sha256", "sha384", "sha512"]);
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const subtle = (() => {
    const c = globalThis.crypto;
    if (!c?.subtle) {
        throw new Error("WebCrypto SubtleCrypto is not available in this environment");
    }
    return c.subtle;
})();
const toB64 = (input) => {
    const bytes = input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};
const fromB64 = (b64) => {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};
const toWebHash = (h) => (h === "sha256" ? "SHA-256" : h === "sha384" ? "SHA-384" : "SHA-512");
const resolveParams = (parameters) => {
    const modulusLength = parameters?.[CryptoParam.RSA_MODULUS_LENGTH] !== undefined
        ? Number.parseInt(parameters[CryptoParam.RSA_MODULUS_LENGTH], 10)
        : DEFAULTS.modulusLength;
    const publicExponent = parameters?.[CryptoParam.RSA_PUBLIC_EXPONENT] !== undefined
        ? Number.parseInt(parameters[CryptoParam.RSA_PUBLIC_EXPONENT], 10)
        : DEFAULTS.publicExponent;
    const oaepHashStr = parameters?.[CryptoParam.OAEP_HASH];
    const oaepHash = oaepHashStr?.toLowerCase() ?? DEFAULTS.oaepHash;
    if (!ALLOWED_MODULUS.has(modulusLength)) {
        throw new Error(`Invalid RSA modulus length. Allowed: ${Array.from(ALLOWED_MODULUS).join(", ")}`);
    }
    if (!ALLOWED_EXPONENTS.has(publicExponent)) {
        throw new Error(`Invalid RSA public exponent. Allowed: ${Array.from(ALLOWED_EXPONENTS).join(", ")}`);
    }
    if (!ALLOWED_HASHES.has(oaepHash)) {
        throw new Error(`Invalid OAEP hash. Allowed: ${Array.from(ALLOWED_HASHES).join(", ")}`);
    }
    return { modulusLength, publicExponent, oaepHash, webHash: toWebHash(oaepHash) };
};
// LRU caches for imported CryptoKey objects (avoid re-importing keys)
let publicKeyCache;
const pkCache = () => {
    if (!publicKeyCache) {
        publicKeyCache = new LRUCache({
            maxSize: 2048,
            maxAge: SIX_HOURS_MS,
            touchOnGet: true,
        });
    }
    return publicKeyCache;
};
let privateKeyCache;
const pvCache = () => {
    if (!privateKeyCache) {
        privateKeyCache = new LRUCache({
            maxSize: 2048,
            maxAge: SIX_HOURS_MS,
            touchOnGet: true,
        });
    }
    return privateKeyCache;
};
const cacheKey = (hash, keyB64) => `${hash}|${keyB64}`;
const importPublicKey = async (publicKeyB64, webHash) => {
    const k = cacheKey(webHash, publicKeyB64);
    const cached = pkCache().get(k);
    if (cached !== undefined)
        return cached;
    const key = await subtle.importKey("spki", fromB64(publicKeyB64), // BufferSource
    { name: "RSA-OAEP", hash: webHash }, false, ["encrypt"]);
    pkCache().set(k, key);
    return key;
};
const importPrivateKey = async (privateKeyB64, webHash) => {
    const k = cacheKey(webHash, privateKeyB64);
    const cached = pvCache().get(k);
    if (cached !== undefined)
        return cached;
    const key = await subtle.importKey("pkcs8", fromB64(privateKeyB64), // BufferSource
    { name: "RSA-OAEP", hash: webHash }, false, ["decrypt"]);
    pvCache().set(k, key);
    return key;
};
const resolvePublicKeyB64 = (key) => (typeof key === "string" ? key : key.publicKey);
const resolvePrivateKeyB64 = (key) => (typeof key === "string" ? key : key.privateKey);
export const CryptoUtil = {
    generateKeyPair: async (parameters) => {
        const { modulusLength, publicExponent, webHash } = resolveParams(parameters);
        if (publicExponent !== 65537) {
            throw new Error("Only RSA public exponent 65537 is supported");
        }
        const expBytes = new Uint8Array([0x01, 0x00, 0x01]); // 65537
        const webPair = await subtle.generateKey({ name: "RSA-OAEP", modulusLength, publicExponent: expBytes, hash: webHash }, true, // extractable (so we can export to SPKI/PKCS8)
        ["encrypt", "decrypt"]);
        const spki = await subtle.exportKey("spki", webPair.publicKey);
        const pkcs8 = await subtle.exportKey("pkcs8", webPair.privateKey);
        const result = {
            publicKey: toB64(spki),
            privateKey: toB64(pkcs8),
        };
        return result;
    },
    encrypt: async (publicKey, plaintext, parameters) => {
        const { webHash } = resolveParams(parameters);
        const pubB64 = resolvePublicKeyB64(publicKey);
        const keyObj = await importPublicKey(pubB64, webHash);
        const data = new TextEncoder().encode(plaintext);
        const ciphertext = await subtle.encrypt({ name: "RSA-OAEP" }, keyObj, data);
        return toB64(ciphertext);
    },
    decrypt: async (privateKey, ciphertext, parameters) => {
        const { webHash } = resolveParams(parameters);
        const privB64 = resolvePrivateKeyB64(privateKey);
        const keyObj = await importPrivateKey(privB64, webHash);
        const ptBuf = await subtle.decrypt({ name: "RSA-OAEP" }, keyObj, fromB64(ciphertext));
        const plaintext = new TextDecoder().decode(new Uint8Array(ptBuf));
        return plaintext;
    },
};
//# sourceMappingURL=crypto.js.map