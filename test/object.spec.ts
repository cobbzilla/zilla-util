import { describe } from "mocha";
import {firstKeyByValue, keysByValue, reverseEnum} from "../src/index.js";
import { expect } from "chai";

describe("object", () => {
    it("keysByValue", () => {
        expect(keysByValue({ foo: "bar", baz: "baz", quux: "bar" }, "bar")).to.deep.eq(["foo", "quux"]);
    });
    it("firstKeyByValue", () => {
        expect(firstKeyByValue({ foo: "bar", baz: "baz", quux: "bar" }, "bar")).to.be.eq("foo");
    });
    it("reverseEnum", () => {
        enum TestEnum {
            foo = "bar",
            baz = "quux"
        }
        const reversed = reverseEnum(TestEnum)
        expect(reversed.bar).to.eq("foo")
        expect(reversed.quux).to.eq("baz")
    })
});
