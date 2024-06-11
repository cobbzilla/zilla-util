import { describe, it } from "mocha";
import { expect } from "chai";
import { base64Encode, base64Decode, randomSafeToken, generateRandomString } from "../lib/esm/index.js";

describe("test base64", () => {
    it("correctly encodes and decodes a Base64 string", () => {
        const token = randomSafeToken(10000);
        expect(token).eq(base64Decode(base64Encode(token)));
    });
    it("correctly encodes and decodes a pathological Base64 string", () => {
        const token = generateRandomString(100000);
        expect(token).eq(base64Decode(base64Encode(token)));
    });
});
