import { expect } from "chai";
import { delay, parseSimpleTime } from "../lib/esm/index.js";

describe("time", () => {
    it("parses simple time strings correctly", () => {
        expect(parseSimpleTime("10")).to.be.eq(10);
        expect(parseSimpleTime("2s")).to.be.eq(2 * 1000);
        expect(parseSimpleTime("3m")).to.be.eq(3 * 60 * 1000);
        expect(parseSimpleTime("4h")).to.be.eq(4 * 60 * 60 * 1000);
        expect(parseSimpleTime("5d")).to.be.eq(5 * 24 * 60 * 60 * 1000);
        expect(parseSimpleTime("1.234s")).to.be.eq(1234);
        expect(parseSimpleTime("1.234567s")).to.be.eq(1234.567);
    });
    it("delays 1000 milliseconds", async () => {
        const start = Date.now();
        await delay(1000);
        const end = Date.now();
        expect(end - start).to.be.gte(1000);
        expect(end - start).to.be.lte(1100);
    });
    it("delays 0.8s", async () => {
        const start = Date.now();
        await delay("0.8s");
        const end = Date.now();
        expect(end - start).to.be.gte(800);
        expect(end - start).to.be.lte(900);
    });
    it("does not delay", async () => {
        const start = Date.now();
        await delay();
        const end = Date.now();
        expect(end - start).to.be.lte(20);
    });
});
