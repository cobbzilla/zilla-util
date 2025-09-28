// crypto-util.ts (browser-only, no Node APIs)
import { LRUCache } from "zilla-util";

export enum CryptoParam {
    RSA_MODULUS_LENGTH = "RSA_MODULUS_LENGTH",
    RSA_PUBLIC_EXPONENT = "RSA_PUBLIC_EXPONENT",
    OAEP_HASH = "OAEP_HASH",
}

export type CryptoKeyPair = {
    publicKey: string; // base64-encoded SPKI
    privateKey: string; // base64-encoded PKCS#8
};

type SafeHash = "sha256" | "sha384" | "sha512";
type WebHash = "SHA-256" | "SHA-384" | "SHA-512";
type WebCryptoKeyPair = globalThis.CryptoKeyPair;

const DEFAULTS: Readonly<{
    modulusLength: number;
    publicExponent: number;
    oaepHash: SafeHash;
}> = {
    modulusLength: 3072,
    publicExponent: 65537,
    oaepHash: "sha256",
};

const ALLOWED_MODULUS: ReadonlySet<number> = new Set([2048, 3072, 4096]);
const ALLOWED_EXPONENTS: ReadonlySet<number> = new Set([65537]);
const ALLOWED_HASHES: ReadonlySet<SafeHash> = new Set(["sha256", "sha384", "sha512"]);

const SIX_HOURS_MS: number = 6 * 60 * 60 * 1000;

const subtle: SubtleCrypto = (() => {
    const c: Crypto | undefined = globalThis.crypto as Crypto | undefined;
    if (!c?.subtle) {
        throw new Error("WebCrypto SubtleCrypto is not available in this environment");
    }
    return c.subtle;
})();

const toB64 = (input: ArrayBuffer | ArrayBufferView): string => {
    const bytes: Uint8Array =
        input instanceof ArrayBuffer
            ? new Uint8Array(input)
            : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    let binary: string = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

const fromB64 = (b64: string): Uint8Array => {
    const binary: string = atob(b64);
    const len: number = binary.length;
    const bytes: Uint8Array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

const toWebHash = (h: SafeHash): WebHash => (h === "sha256" ? "SHA-256" : h === "sha384" ? "SHA-384" : "SHA-512");

// Add these utilities (kept local to signature ops)
const cacheKeySig = (hash: WebHash, keyB64: string): string => `sig|${hash}|${keyB64}`;

const importPublicKeyForVerify = async (publicKeyB64: string, webHash: WebHash): Promise<CryptoKey> => {
    const k: string = cacheKeySig(webHash, publicKeyB64);
    const cached: CryptoKey | undefined = pkCache().get(k);
    if (cached !== undefined) return cached;

    const key: CryptoKey = await subtle.importKey(
        "spki",
        fromB64(publicKeyB64),
        { name: "RSASSA-PKCS1-v1_5", hash: webHash },
        false,
        ["verify"]
    );
    pkCache().set(k, key);
    return key;
};

const importPrivateKeyForSign = async (privateKeyB64: string, webHash: WebHash): Promise<CryptoKey> => {
    const k: string = cacheKeySig(webHash, privateKeyB64);
    const cached: CryptoKey | undefined = pvCache().get(k);
    if (cached !== undefined) return cached;

    const key: CryptoKey = await subtle.importKey(
        "pkcs8",
        fromB64(privateKeyB64),
        { name: "RSASSA-PKCS1-v1_5", hash: webHash },
        false,
        ["sign"]
    );
    pvCache().set(k, key);
    return key;
};

const resolveParams = (
    parameters?: Partial<Record<CryptoParam, string>>
): {
    modulusLength: number;
    publicExponent: number;
    oaepHash: SafeHash;
    webHash: WebHash;
} => {
    const modulusLength: number =
        parameters?.[CryptoParam.RSA_MODULUS_LENGTH] !== undefined
            ? Number.parseInt(parameters[CryptoParam.RSA_MODULUS_LENGTH], 10)
            : DEFAULTS.modulusLength;

    const publicExponent: number =
        parameters?.[CryptoParam.RSA_PUBLIC_EXPONENT] !== undefined
            ? Number.parseInt(parameters[CryptoParam.RSA_PUBLIC_EXPONENT], 10)
            : DEFAULTS.publicExponent;

    const oaepHashStr: string | undefined = parameters?.[CryptoParam.OAEP_HASH];
    const oaepHash: SafeHash = (oaepHashStr?.toLowerCase() as SafeHash | undefined) ?? DEFAULTS.oaepHash;

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
let publicKeyCache: LRUCache<string, CryptoKey>;
const pkCache = () => {
    if (!publicKeyCache) {
        publicKeyCache = new LRUCache<string, CryptoKey>({
            maxSize: 2048,
            maxAge: SIX_HOURS_MS,
            touchOnGet: true,
        });
    }
    return publicKeyCache;
};

let privateKeyCache: LRUCache<string, CryptoKey>;
const pvCache = () => {
    if (!privateKeyCache) {
        privateKeyCache = new LRUCache<string, CryptoKey>({
            maxSize: 2048,
            maxAge: SIX_HOURS_MS,
            touchOnGet: true,
        });
    }
    return privateKeyCache;
};

const cacheKey = (hash: WebHash, keyB64: string): string => `${hash}|${keyB64}`;

const importPublicKey = async (publicKeyB64: string, webHash: WebHash): Promise<CryptoKey> => {
    const k: string = cacheKey(webHash, publicKeyB64);
    const cached: CryptoKey | undefined = pkCache().get(k);
    if (cached !== undefined) return cached;

    const key: CryptoKey = await subtle.importKey(
        "spki",
        fromB64(publicKeyB64), // BufferSource
        { name: "RSA-OAEP", hash: webHash },
        false,
        ["encrypt"]
    );
    pkCache().set(k, key);
    return key;
};

const importPrivateKey = async (privateKeyB64: string, webHash: WebHash): Promise<CryptoKey> => {
    const k: string = cacheKey(webHash, privateKeyB64);
    const cached: CryptoKey | undefined = pvCache().get(k);
    if (cached !== undefined) return cached;

    const key: CryptoKey = await subtle.importKey(
        "pkcs8",
        fromB64(privateKeyB64), // BufferSource
        { name: "RSA-OAEP", hash: webHash },
        false,
        ["decrypt"]
    );
    pvCache().set(k, key);
    return key;
};

const resolvePublicKeyB64 = (key: string | CryptoKeyPair): string => (typeof key === "string" ? key : key.publicKey);
const resolvePrivateKeyB64 = (key: string | CryptoKeyPair): string => (typeof key === "string" ? key : key.privateKey);

export const CryptoUtil = {
    generateKeyPair: async (parameters?: Partial<Record<CryptoParam, string>>): Promise<CryptoKeyPair> => {
        const { modulusLength, publicExponent, webHash } = resolveParams(parameters);

        if (publicExponent !== 65537) {
            throw new Error("Only RSA public exponent 65537 is supported");
        }

        const expBytes: Uint8Array = new Uint8Array([0x01, 0x00, 0x01]); // 65537

        const webPair: WebCryptoKeyPair = await subtle.generateKey(
            { name: "RSA-OAEP", modulusLength, publicExponent: expBytes, hash: webHash },
            true, // extractable (so we can export to SPKI/PKCS8)
            ["encrypt", "decrypt"]
        );

        const spki: ArrayBuffer = await subtle.exportKey("spki", webPair.publicKey);
        const pkcs8: ArrayBuffer = await subtle.exportKey("pkcs8", webPair.privateKey);

        const result: CryptoKeyPair = {
            publicKey: toB64(spki),
            privateKey: toB64(pkcs8),
        };
        return result;
    },

    encrypt: async (
        publicKey: string | CryptoKeyPair,
        plaintext: string,
        parameters?: Partial<Record<CryptoParam, string>>
    ): Promise<string> => {
        const { webHash } = resolveParams(parameters);
        const pubB64: string = resolvePublicKeyB64(publicKey);
        const keyObj: CryptoKey = await importPublicKey(pubB64, webHash);

        const data: Uint8Array = new TextEncoder().encode(plaintext);
        const ciphertext: ArrayBuffer = await subtle.encrypt({ name: "RSA-OAEP" }, keyObj, data);
        return toB64(ciphertext);
    },

    decrypt: async (
        privateKey: string | CryptoKeyPair,
        ciphertext: string,
        parameters?: Partial<Record<CryptoParam, string>>
    ): Promise<string> => {
        const { webHash } = resolveParams(parameters);
        const privB64: string = resolvePrivateKeyB64(privateKey);
        const keyObj: CryptoKey = await importPrivateKey(privB64, webHash);

        const ptBuf: ArrayBuffer = await subtle.decrypt({ name: "RSA-OAEP" }, keyObj, fromB64(ciphertext));
        const plaintext: string = new TextDecoder().decode(new Uint8Array(ptBuf));
        return plaintext;
    },

    sign: async (
        privateKey: string | CryptoKeyPair,
        data: string,
        parameters?: Partial<Record<CryptoParam, string>>
    ): Promise<string> => {
        const { webHash } = resolveParams(parameters);
        const privB64: string = resolvePrivateKeyB64(privateKey);
        const keyObj: CryptoKey = await importPrivateKeyForSign(privB64, webHash);

        const bytes: Uint8Array = new TextEncoder().encode(data);
        const sigBuf: ArrayBuffer = await subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, keyObj, bytes);
        return toB64(sigBuf);
    },

    verifySignature: async (
        publicKey: string | CryptoKeyPair,
        data: string,
        signatureB64: string,
        parameters?: Partial<Record<CryptoParam, string>>
    ): Promise<boolean> => {
        const { webHash } = resolveParams(parameters);
        const pubB64: string = resolvePublicKeyB64(publicKey);
        const keyObj: CryptoKey = await importPublicKeyForVerify(pubB64, webHash);

        const bytes: Uint8Array = new TextEncoder().encode(data);
        const sigBytes: Uint8Array = fromB64(signatureB64);
        const ok: boolean = await subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, keyObj, sigBytes, bytes);
        return ok;
    },
};
