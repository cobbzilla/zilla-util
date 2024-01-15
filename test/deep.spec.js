import { describe, it } from "mocha";
import { expect } from "chai";
import {
    deepGet,
    deepUpdate,
    deepEquals,
    stripNonAlphaNumericKeys,
    hasDuplicateProperty,
    hasUniqueProperty,
} from "../lib/esm/index.js";

describe("test deepUpdate and deepGet", () => {
    it("correctly deep-updates a nested object", () => {
        const thing = { foo: { bar: { baz: "quux" }, snarf: 42 } };
        deepUpdate(thing, "foo.bar.baz", "test");
        expect(thing.foo.bar.baz).eq("test");
        expect(thing.foo.bar.baz).eq(deepGet(thing, "foo.bar.baz"));

        deepUpdate(thing, "foo.bar.snarf", 23);
        expect(thing.foo.bar.snarf).eq(23);
        expect(thing.foo.bar.snarf).eq(deepGet(thing, "foo.bar.snarf"));

        deepUpdate(thing, "foo.whiz", "kid");
        expect(thing.foo.whiz).eq("kid");
        expect(thing.foo.whiz).eq(deepGet(thing, "foo.whiz"));
    });
    it("correctly deep-updates and appends to nested arrays", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } };
        deepUpdate(thing, "foo.bar[2].baz.quux", "test");
        expect(thing.foo.bar[2].baz.quux).eq("test");
        expect(thing.foo.bar[2].baz.quux).eq(deepGet(thing, "foo.bar[2].baz.quux"));

        deepUpdate(thing, "foo.snarf[]", "d");
        expect(thing.foo.snarf.length).eq(4);
        expect(thing.foo.snarf[thing.foo.snarf.length - 1]).eq("d");
        expect(thing.foo.snarf[thing.foo.snarf.length - 1]).eq(
            deepGet(thing, `foo.snarf[${thing.foo.snarf.length - 1}]`)
        );

        deepUpdate(thing, "arry", []);
        expect(thing.arry.length).eq(0);
        expect(thing.arry).eq(deepGet(thing, "arry"));

        deepUpdate(thing, "arry[]", "foo");
        expect(thing.arry.length).eq(1);
        expect(thing.arry[0]).eq("foo");
        expect(thing.arry[0]).eq(deepGet(thing, "arry[0]"));
    });
    it("correctly deep-updates and appends to multiply-nested arrays", () => {
        const thing = { foo: { bar: [1, 2, [4, 5, [6, 7]]] } };
        deepUpdate(thing, "foo.bar[2][1]", 42);
        expect(thing.foo.bar[2][1]).eq(42);
        expect(thing.foo.bar[2][1]).eq(deepGet(thing, "foo.bar[2][1]"));

        deepUpdate(thing, "foo.bar[2][2][]", 23);
        expect(thing.foo.bar[2][2][2]).eq(23);
        expect(thing.foo.bar[2][2][2]).eq(deepGet(thing, "foo.bar[2][2][2]"));
    });
    it("can deep-update after append", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } };
        deepUpdate(thing, "foo.bar[].baz.quux", "test");
        expect(thing.foo.bar[3].baz.quux).eq("test");
    });
    it("can create new arrays when using deep-update after append", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } };
        deepUpdate(thing, "foo.whiz[].baz.quux", "test");
        expect(thing.foo.whiz[0].baz.quux).eq("test");
    });
    it("correctly deep-updates to remove a subobject in an array", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } };
        deepUpdate(thing, "foo.bar[-1]", null);
        expect(thing.foo.bar.length).eq(2);
        expect(thing.foo.bar[0]).eq(1);
        expect(thing.foo.bar[1].baz.quux).eq("whiz");

        deepUpdate(thing, "foo.snarf[-0]", undefined);
        expect(thing.foo.snarf.length).eq(2);
        expect(thing.foo.snarf[0]).eq("b");
        expect(thing.foo.snarf[1]).eq("c");
    });
});

describe("test stripNonAlphaNumericKeys", () => {
    it("correctly removes keys containing non-alphanumeric characters", () => {
        const testObj = {
            name: "Test",
            "bad[key]": "value",
            nested: {
                "key.other": "value",
                goodKey: "value",
            },
        };
        const cleaned = stripNonAlphaNumericKeys(testObj);
        expect(cleaned.name).eq("Test");
        expect(cleaned["bad[key]"]).is.undefined;
        expect(cleaned.nested.goodKey).eq("value");
        expect(cleaned.nested["key.other"]).is.undefined;
    });
});

describe("test hasDuplicateProperty", () => {
    it("correctly detected duplicate properties", () => {
        const testObj = [{ foo: "bar" }, { foo: "baz" }, { foo: "bar" }];
        expect(hasDuplicateProperty(testObj, "foo")).is.true;
        expect(hasUniqueProperty(testObj, "foo")).is.false;
    });
    it("correctly does not detect duplicate properties where there are none", () => {
        const testObj = [{ foo: "bar" }, { foo: "baz" }, { foo: "quux" }];
        expect(hasDuplicateProperty(testObj, "foo")).is.false;
        expect(hasUniqueProperty(testObj, "foo")).is.true;
    });
});

describe("test deepGet for undefined and null", () => {
    it("deepGet correctly handles a case where a path includes an undefined thing or a null thing", () => {
        const testObj = { foo: { bar: "baz" }, quux: null };
        expect(deepGet(testObj, "foo.baz")).is.undefined;
        expect(deepGet(testObj, "foo.baz.quux")).is.undefined;
        expect(deepGet(testObj, "quux")).is.null;
        expect(deepGet(testObj, "quux.snarf")).is.undefined;
    });
});

describe("test deepEquals", () => {
    it("deepEquals correctly compares primitives", () => {
        expect(deepEquals(1, 2 - 1)).is.true;
        expect(deepEquals(1, 2)).is.false;
        expect(deepEquals(1, "2")).is.false;
        expect(deepEquals(1, "1")).is.false;
        expect(deepEquals("1", "1")).is.true;
        expect(deepEquals(false, false)).is.true;
        expect(deepEquals(false, true)).is.false;
    });
    it("deepEquals correctly compares objects with properties in different order that match", () => {
        const o1 = { foo: "bar", baz: "quux" };
        const o2 = { baz: "quux", foo: "bar" };
        expect(deepEquals(o1, o2)).is.true;
    });
    it("deepEquals correctly compares objects with properties in different order that do not match", () => {
        const o1 = { foo: "bar", baz: "quux" };
        const o2 = { baz: "quux", foo: "baz" };
        const o3 = { foo: "bar", baz: "quux", snarf: true };
        expect(deepEquals(o1, o2)).is.false;
        expect(deepEquals(o1, o3)).is.false;
    });
});
