import { expect } from "chai";
import { parseSimpleTime } from "../lib/esm/index.js";

describe("time", () => {
    it("parses simple time strings correctly", () => {
        expect(parseSimpleTime("10")).to.be.eq(10);
        expect(parseSimpleTime("2s")).to.be.eq(2 * 1000);
        expect(parseSimpleTime("3m")).to.be.eq(3 * 60 * 1000);
        expect(parseSimpleTime("4h")).to.be.eq(4 * 60 * 60 * 1000);
        expect(parseSimpleTime("5d")).to.be.eq(5 * 24 * 60 * 60 * 1000);
    });
});
