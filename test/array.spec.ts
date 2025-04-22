import { describe, it } from "mocha";
import { expect } from "chai";
import {
    cartesianProduct,
    firstByProperty,
    setsEqual,
    isAnyTrue,
    insertAfterElement,
    asyncFilter,
    shuffleNumbers,
    SortedIdSet,
} from "../lib/esm/index.js";

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

describe("test asyncFilter", () => {
    it("correctly filters an array using an async predicate", async () => {
        const arr = [1, 2, 3, 4, 5];
        const filtered = await asyncFilter(arr, async (el) => {
            return await Promise.resolve(el % 2 === 1);
        });
        expect(filtered).deep.eq([1, 3, 5]);
    });
});

describe("test shuffleNumbers", () => {
    it("correctly shuffles a list of numbers of random length", () => {
        const limit = Math.floor(Math.random() * 100);
        const shuffled = shuffleNumbers(limit);
        expect(shuffled.length).eq(limit);
        for (let i = 0; i < limit; i++) {
            expect(shuffled.includes(i)).eq(true);
        }
    });
    it("correctly shuffles a list of numbers of zero length", () => {
        const limit = 0;
        const shuffled = shuffleNumbers(limit);
        expect(shuffled.length).eq(0);
    });
    it("correctly shuffles a single index", () => {
        const limit = 1;
        const shuffled = shuffleNumbers(limit);
        expect(shuffled.length).eq(1);
        expect(shuffled[0]).eq(0);
    });
    it("correctly shuffles a short list of numbers", () => {
        const limit = 5;
        const shuffled = shuffleNumbers(limit);
        expect(shuffled.length).eq(limit);
        expect(shuffled.includes(0)).eq(true);
        expect(shuffled.includes(1)).eq(true);
        expect(shuffled.includes(2)).eq(true);
        expect(shuffled.includes(3)).eq(true);
        expect(shuffled.includes(4)).eq(true);
    });
});

type TestItem = {
    id: string;
    value: number;
};

describe("test SortedIdSet", () => {
    it("correctly manages items in a SortedIdSet", () => {
        const comp = (a: TestItem, b: TestItem): number => a.value - b.value;
        const id = (a: TestItem): string => a.id;
        const set = new SortedIdSet(comp, id);

        const data: TestItem[] = [
            { id: "1", value: 1 },
            { id: "1", value: 2 },
            { id: "1", value: 2 },
            { id: "1", value: 2 },
            { id: "1", value: 3 },
            { id: "1", value: 4 },
            { id: "1", value: 5 },
            { id: "1", value: 6 },
            { id: "2", value: 50 },
            { id: "2", value: 50 },
            { id: "2", value: 60 },
            { id: "2", value: 70 },
        ];

        for (const i of data) set.add(i);

        const array = set.toArray();
        expect(array.length).eq(2);
        expect(array[0].id).eq("1");
        expect(array[0].value).eq(1);
        expect(array[1].id).eq("2");
        expect(array[1].value).eq(50);
    });
});

describe("test firstByProperty", () => {
    it("correctly filters objects by property", () => {
        const data = [
            { id: 1, val: "1" },
            { id: 2, val: "2" },
            { id: 3, val: "2" },
            { id: 4, val: "1" },
            { id: 5, val: "5" },
            { id: 6, val: "0" },
            { id: 7, val: "1" },
        ];
        const expected = [
            { id: 1, val: "1" },
            { id: 2, val: "2" },
            { id: 5, val: "5" },
            { id: 6, val: "0" },
        ];
        const filtered = firstByProperty(data, "val");
        expect(filtered).deep.eq(expected);
    });
});
