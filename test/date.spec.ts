import { expect } from "chai";
import "mocha";
import { ZillaClock, formatDate } from "../lib/esm";

describe("formatDate", () => {
    const testClock: ZillaClock = { now: () => new Date("2020-01-02T03:04:05Z").getTime() };

    it("replaces YYYY", () => {
        expect(formatDate("YYYY", testClock)).to.equal("2020");
    });

    it("replaces YY", () => {
        expect(formatDate("YY", testClock)).to.equal("20");
    });

    it("replaces MM and DD", () => {
        expect(formatDate("MM-DD", testClock)).to.equal("01-02");
    });

    it("replaces HH:mm:ss", () => {
        expect(formatDate("HH:mm:ss", testClock)).to.equal("03:04:05");
    });

    it("handles single-quoted text", () => {
        expect(formatDate("YYYY' is year 'DD", testClock)).to.equal("2020 is year 02");
    });

    it("handles optional clock (real time)", () => {
        // Just ensure it runs without clock
        const output = formatDate("YYYY-MM-DD");
        expect(output).to.be.a("string");
    });

    it("passes through non-format chars", () => {
        expect(formatDate("Jello_YYYY!", testClock)).to.equal("Jello_2020!");
    });

    it("supports short tokens (M, D, H, m, s)", () => {
        expect(formatDate("M-D H:m:s", testClock)).to.equal("1-2 3:4:5");
    });

    it("handles complex mixed patterns", () => {
        expect(formatDate("YY'/'MM'/'DD-HH:mm", testClock)).to.equal("20/01/02-03:04");
    });
});
