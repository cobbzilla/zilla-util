import { describe } from "mocha";
import { firstKeyByValue, keysByValue } from "../src/index.js";
import { expect } from "chai";

describe("object", () => {
    it("keysByValue", () => {
        expect(keysByValue({ foo: "bar", baz: "baz", quux: "bar" }, "bar")).to.deep.eq(["foo", "quux"]);
    });
    it("firstKeyByValue", () => {
        expect(firstKeyByValue({ foo: "bar", baz: "baz", quux: "bar" }, "bar")).to.be.eq("foo");
    });
});
