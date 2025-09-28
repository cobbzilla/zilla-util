// crypto.spec.ts
import { expect } from "chai";
import { describe, it } from "mocha";
import { CryptoParam, CryptoUtil, CryptoKeyPair } from "../src/index.js";

const hasWebCrypto = (): boolean => Boolean((globalThis as any).crypto && (globalThis as any).crypto.subtle);

describe("CryptoUtil (WebCrypto, browser-compatible)", function () {
    it("environment has WebCrypto", function () {
        if (!hasWebCrypto()) this.skip();
    });

    it("generates an RSA keypair as base64 DER", async () => {
        const kp: CryptoKeyPair = await CryptoUtil.generateKeyPair();
        expect(typeof kp.publicKey).to.equal("string");
        expect(typeof kp.privateKey).to.equal("string");
        expect(kp.publicKey.length).to.be.greaterThan(100);
        expect(kp.privateKey.length).to.be.greaterThan(100);
    });

    it("encrypts and decrypts round-trip with defaults", async () => {
        const kp: CryptoKeyPair = await CryptoUtil.generateKeyPair();
        const msg: string = "hello asymmetric webcrypto";
        const ct: string = await CryptoUtil.encrypt(kp.publicKey, msg);
        const pt: string = await CryptoUtil.decrypt(kp.privateKey, ct);
        expect(pt).to.equal(msg);
    });

    it("accepts CryptoKeyPair inputs to encrypt/decrypt", async () => {
        const kp: CryptoKeyPair = await CryptoUtil.generateKeyPair();
        const msg: string = "pair input works";
        const ct: string = await CryptoUtil.encrypt(kp, msg);
        const pt: string = await CryptoUtil.decrypt(kp, ct);
        expect(pt).to.equal(msg);
    });

    it("fails to decrypt with a different private key", async () => {
        const kp1: CryptoKeyPair = await CryptoUtil.generateKeyPair();
        const kp2: CryptoKeyPair = await CryptoUtil.generateKeyPair();
        const ct: string = await CryptoUtil.encrypt(kp1.publicKey, "secret");
        let failed: boolean = false;
        try {
            await CryptoUtil.decrypt(kp2.privateKey, ct);
        } catch {
            failed = true;
        }
        expect(failed).to.equal(true);
    });

    it("respects OAEP hash parameter and mismatched hash fails", async () => {
        const genParams: Partial<Record<CryptoParam, string>> = {
            [CryptoParam.RSA_MODULUS_LENGTH]: "2048",
            [CryptoParam.OAEP_HASH]: "sha384",
        };
        const kp: CryptoKeyPair = await CryptoUtil.generateKeyPair(genParams);

        const p384: Partial<Record<CryptoParam, string>> = { [CryptoParam.OAEP_HASH]: "sha384" };
        const p256: Partial<Record<CryptoParam, string>> = { [CryptoParam.OAEP_HASH]: "sha256" };

        const msg: string = "oaep hash test";
        const ct: string = await CryptoUtil.encrypt(kp.publicKey, msg, p384);

        const ok: string = await CryptoUtil.decrypt(kp.privateKey, ct, p384);
        expect(ok).to.equal(msg);

        let failed: boolean = false;
        try {
            await CryptoUtil.decrypt(kp.privateKey, ct, p256);
        } catch {
            failed = true;
        }
        expect(failed).to.equal(true);
    });

    it("handles repeated operations (LRU warm path)", async () => {
        const kp: CryptoKeyPair = await CryptoUtil.generateKeyPair({
            [CryptoParam.RSA_MODULUS_LENGTH]: "2048",
            [CryptoParam.OAEP_HASH]: "sha512",
        });
        const params: Partial<Record<CryptoParam, string>> = { [CryptoParam.OAEP_HASH]: "sha512" };
        const msg: string = "cache check";

        const ct1: string = await CryptoUtil.encrypt(kp.publicKey, msg, params);
        const ct2: string = await CryptoUtil.encrypt(kp.publicKey, msg, params);
        const pt1: string = await CryptoUtil.decrypt(kp.privateKey, ct1, params);
        const pt2: string = await CryptoUtil.decrypt(kp.privateKey, ct2, params);

        expect(pt1).to.equal(msg);
        expect(pt2).to.equal(msg);
        expect(ct1).to.be.a("string");
        expect(ct2).to.be.a("string");
    });

    it("rejects invalid parameters", async () => {
        let badLen: boolean = false;
        try {
            await CryptoUtil.generateKeyPair({ [CryptoParam.RSA_MODULUS_LENGTH]: "1024" });
        } catch {
            badLen = true;
        }
        expect(badLen).to.equal(true);

        let badExp: boolean = false;
        try {
            await CryptoUtil.generateKeyPair({ [CryptoParam.RSA_PUBLIC_EXPONENT]: "3" });
        } catch {
            badExp = true;
        }
        expect(badExp).to.equal(true);

        const kp: CryptoKeyPair = await CryptoUtil.generateKeyPair();
        let badHash: boolean = false;
        try {
            const invalid: Record<CryptoParam, string> = { [CryptoParam.OAEP_HASH]: "md5" } as unknown as Record<
                CryptoParam,
                string
            >;
            await CryptoUtil.encrypt(kp.publicKey, "x", invalid);
        } catch {
            badHash = true;
        }
        expect(badHash).to.equal(true);
    });
});
