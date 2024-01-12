import { describe, it } from "mocha";
import { expect } from "chai";
import { cartesianProduct, setsEqual, isAnyTrue, insertAfterElement } from "../lib/esm/index.js";

describe("test setsEqual", () => {
    it("correctly finds two string arrays are equal sets", () => {
        expect(setsEqual(["one", "two"], ["two", "one"])).is.true;
    });
    it("correctly finds two string arrays are not equal sets", () => {
        expect(setsEqual(["one", "two"], ["two", "one", "three"])).is.false;
        expect(setsEqual(["one", "two", "three"], ["two", "one"])).is.false;
    });
});

describe("test cartesianProduct", () => {
    it("correctly creates cartesian product", () => {
        const result = cartesianProduct([
            ["one", "two"],
            ["X", "Y"],
        ]);
        expect(result.length).eq(4);
        expect(result[0].length).eq(2);
        expect(result[0][0]).eq("one");
        expect(result[0][1]).eq("X");
        expect(result[1][0]).eq("one");
        expect(result[1][1]).eq("Y");
        expect(result[2][0]).eq("two");
        expect(result[2][1]).eq("X");
        expect(result[3][0]).eq("two");
        expect(result[3][1]).eq("Y");
    });
});

describe("test isAnyTrue", () => {
    it("correctly finds something true in a list of many false things", () => {
        expect(isAnyTrue([false, false, false, true, false])).is.true;
    });
    it("correctly finds nothing where nothing is to be found", () => {
        expect(isAnyTrue([false, false, false, false, false])).is.false;
    });
});

describe("test insertAfterElement", () => {
    it("correctly inserts elements into list", () => {
        expect(insertAfterElement([1, 2, 3], [4, 5, 6, 7], 5)).to.have.deep.members([4, 5, 1, 2, 3, 6, 7]);
    });
    it("correctly appends elements at end of list when search element not found", () => {
        expect(insertAfterElement([1, 2, 3], [4, 5, 6, 7], 9)).to.have.deep.members([4, 5, 6, 7, 1, 2, 3]);
    });
});
