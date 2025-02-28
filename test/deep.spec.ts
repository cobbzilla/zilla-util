import { describe, it } from "mocha";
import { expect } from "chai";
import {
    deepGet,
    deepUpdate,
    deepEquals,
    deepAtLeastEquals,
    deepEqualsForFields,
    stripNonAlphaNumericKeys,
    hasDuplicateProperty,
    hasUniqueProperty,
    isEmpty,
    isNotEmpty,
    filterProperties,
    immutify,
} from "../src/index.js";

describe("test deepUpdate and deepGet", () => {
    it("correctly deep-updates a nested object", () => {
        const thing = { foo: { bar: { baz: "quux" }, snarf: 42 } } as any;
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
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } } as any;
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
        const thing = { foo: { bar: [1, 2, [4, 5, [6, 7]]] } } as any;
        deepUpdate(thing, "foo.bar[2][1]", 42);
        expect(thing.foo.bar[2][1]).eq(42);
        expect(thing.foo.bar[2][1]).eq(deepGet(thing, "foo.bar[2][1]"));

        deepUpdate(thing, "foo.bar[2][2][]", 23);
        expect(thing.foo.bar[2][2][2]).eq(23);
        expect(thing.foo.bar[2][2][2]).eq(deepGet(thing, "foo.bar[2][2][2]"));
    });
    it("can deep-update after append", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } } as any;
        deepUpdate(thing, "foo.bar[].baz.quux", "test");
        expect(thing.foo.bar[3].baz.quux).eq("test");
    });
    it("can create new arrays when using deep-update after append", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } } as any;
        deepUpdate(thing, "foo.whiz[].baz.quux", "test");
        expect(thing.foo.whiz[0].baz.quux).eq("test");
    });
    it("correctly deep-updates to remove a subobject in an array", () => {
        const thing = { foo: { bar: [1, 2, { baz: { quux: "whiz" } }], snarf: ["a", "b", "c"] } } as any;
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
        expect(deepEquals(1, "2" as any)).is.false;
        expect(deepEquals(1, "1" as any)).is.false;
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

describe("test deepAtLeastEquals", () => {
    it("deepAtLeastEquals correctly compares objects that match identically", () => {
        const o1 = { foo: "bar", baz: "quux" };
        const o2 = { baz: "quux", foo: "bar" };
        expect(deepAtLeastEquals(o1, o2)).is.true;
    });
    it("deepAtLeastEquals correctly compares objects that match when the second has more properties", () => {
        const o1 = { foo: "bar", baz: "quux" };
        const o2 = { baz: "quux", foo: "bar", snarf: true, extra: "extra" };
        const o3 = { foo: "bar", baz: "quux2", snarf: true, extra: "extra" };
        expect(deepAtLeastEquals(o1, o2)).is.true;
        expect(deepAtLeastEquals(o1, o3)).is.false;
    });
    it("deepAtLeastEquals correctly compares objects that have failed before", () => {
        const o1 = {
            name: "enter_phone",
            step: 1,
            handler: "enter_data",
            handlerFields: ["contact_phone_country", "contact_phone_number"],
            titleMessage: "MSG_title_enter_phone",
            icon: "MSG_icon_phone",
            layout: "phone",
            options: { infoMessage: "MSG_info_enter_phone", helpMessage: "MSG_help_enter_phone" },
            _meta: {
                id: "obd_01948f518024_1b1b5f4bf4404bde877d46a6af739426",
                version: "v_obd_01948f518024_9afeed3de5c54fa6b30e0d5a65e81478",
                ctime: 1737571270692,
                mtime: 1737571270692,
            },
        };
        const o2 = {
            _meta: {
                id: "obd_01948f518024_1b1b5f4bf4404bde877d46a6af739426",
                version: "v_obd_01948f51802a_e16b1735d47546c98d894c3f698d2119",
                ctime: 1737571270698,
                mtime: 1737571270698,
            },
            id: "obd_01948f518024_1b1b5f4bf4404bde877d46a6af739426",
            step: 1,
            name: "enter_phone",
            handler: null,
            handlerFields: null,
            nextIf: null,
            titleMessage: "MSG_title_enter_phone",
            icon: "MSG_icon_phone",
            layout: "phone",
            options: {
                infoMessage: "MSG_info_enter_phone",
                helpMessage: "MSG_help_enter_phone",
                verificationSentMessage: null,
                verificationRetryMessage: null,
                verificationRetryButtonHeaderMessage: null,
                verificationRetryEditButtonMessage: null,
                verificationRetryRetryButtonMessage: null,
                footerMessage: null,
                enableButtonMessage: null,
                disableButtonMessage: null,
                optOutMessage: null,
                textFieldMessage: null,
                textChoicesMessages: null,
                imageChoices: null,
                multiSelect: null,
            },
        };
        expect(deepAtLeastEquals<any>(o1, o2)).is.false;
        expect(deepAtLeastEquals<any>(o1, o2, ["_meta", "handler", "handlerFields"])).is.true;
    });
});

describe("test isEmpty and isNotEmpty", () => {
    it("isEmpty and isNotEmpty correctly tests null for emptiness", () => {
        expect(isEmpty(null)).is.true;
        expect(isNotEmpty(null)).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests undefined for emptiness", () => {
        expect(isEmpty(undefined)).is.true;
        expect(isNotEmpty(undefined)).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests no-arg for emptiness", () => {
        expect(isEmpty()).is.true;
        expect(isNotEmpty()).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests empty string for emptiness", () => {
        expect(isEmpty("")).is.true;
        expect(isNotEmpty("")).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests empty array for emptiness", () => {
        expect(isEmpty([])).is.true;
        expect(isNotEmpty([])).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests empty object for emptiness", () => {
        expect(isEmpty({})).is.true;
        expect(isNotEmpty({})).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests a deeply-empty object for emptiness", () => {
        const emptyThing = { field: undefined, other: null, array: [], obj: { nested: [], stuff: null }, message: "" };
        expect(isEmpty(emptyThing)).is.true;
        expect(isNotEmpty({})).is.false;
    });
    it("isEmpty and isNotEmpty correctly tests a string for non-emptiness", () => {
        expect(isEmpty("x")).is.false;
        expect(isNotEmpty("x")).is.true;
    });
    it("isEmpty and isNotEmpty correctly tests a number for non-emptiness", () => {
        expect(isEmpty(42)).is.false;
        expect(isNotEmpty(42)).is.true;
    });
    it("isEmpty and isNotEmpty correctly tests the number zero for non-emptiness", () => {
        expect(isEmpty(0)).is.false;
        expect(isNotEmpty(0)).is.true;
    });
    it("isEmpty and isNotEmpty correctly tests 'true' for non-emptiness", () => {
        expect(isEmpty(true)).is.false;
        expect(isNotEmpty(true)).is.true;
    });
    it("isEmpty and isNotEmpty correctly tests 'false' for non-emptiness", () => {
        expect(isEmpty(false)).is.false;
        expect(isNotEmpty(false)).is.true;
    });
});

describe("filterProperties test", () => {
    it("filters properties correctly", () => {
        const obj: Record<string, any> = {
            foo: 1,
            bar: "123",
            baz: [5, 6, 9],
        };
        const filtered: Record<string, any> = filterProperties(obj, ["bar", "baz"]);
        expect(Object.keys(filtered)).length(2);
        expect(filtered.bar).eq("123");
        expect(filtered.baz).length(3);
        expect(filtered.baz[0]).eq(5);
        expect(filtered.baz[1]).eq(6);
        expect(filtered.baz[2]).eq(9);
        expect(JSON.stringify(filtered)).eq('{"bar":"123","baz":[5,6,9]}');
    });
});

type TestType = {
    name: string;
    value: number;
};
type TestType1 = TestType & {
    foo: string;
};
type TestType2 = TestType & {
    bar: string;
};

describe("deepEqualsForFields test", () => {
    it("successfully compares two different types that extend a common type that match on the common type and differ in subtype fields", () => {
        const o1: TestType1 = { name: "abc", value: 123, foo: "foo" };
        const o2: TestType2 = { name: "abc", value: 123, bar: "bar" };
        expect(deepEqualsForFields(o1, o2, ["name", "value"])).is.true;
    });
    it("successfully compares two different types that extend a common type that do not match on the common type", () => {
        const o1: TestType1 = { name: "abc", value: 123, foo: "foo" };
        const o2: TestType2 = { name: "abc", value: 456, bar: "bar" };
        expect(deepEqualsForFields(o1, o2, ["name", "value"])).is.false;
    });
});

describe("immutify test", () => {
    it("successfully maintains immutability on an immutified object", () => {
        const target: any = {
            foo: "bar",
            baz: {
                quux: [1, 2, 3],
            },
            func: () => {
                console.log("func was called");
                return 42;
            },
        };
        target.mutator = () => (target.foo = "changed");

        const obj: any = immutify(target);
        // obj.foo is not actually changed, the previous value remains
        obj.foo = obj.foo + "_changed";
        expect(obj.foo).to.be.eq("bar");

        // obj.baz is not actually overwritten, the quux array remains
        obj.baz = {};
        expect(obj.baz.quux.length).to.be.eq(3);

        // the obj.baz.quux array is not actually appended-to, the previous array entries remain unchanged
        obj.baz.quux.append(1000);
        expect(obj.baz.quux.length).to.be.eq(3);

        // the first cell in the obj.baz.quux is not actually overwritten, the previous array entries remain unchanged
        obj.baz.quux[0] = 99;
        expect(obj.baz.quux[0]).to.be.eq(1);

        // incrementing the first cell in the obj.baz.quux array does nothing, the previous value remains unchanged
        obj.baz.quux[0]++;
        expect(obj.baz.quux[0]).to.be.eq(1);

        // the additional field snarf is not actually added
        obj.snarf = "additional field";
        expect(obj.snarf).to.be.undefined;

        // obj.baz is not actually deleted, the quux array remains unchanged
        delete obj.baz;
        expect(obj.baz.quux[0]).to.be.eq(1);

        // obj.func works as expected
        expect(obj.func()).to.be.eq(42);

        // obj.mutator still works -- it actually does mutate
        expect(obj.mutator()).to.be.eq("changed");
        expect(obj.foo).to.be.eq("changed");
    });
});

describe("stripNonAlphaNumericKeys", () => {
    it("correctly strips non-alphanumeric keys from an object", () => {
        const obj = {
            key: "value",
            "@at": "at",
            nested: { ok: "ok", "not!ok": 42 },
        };
        expect(stripNonAlphaNumericKeys(obj)).to.deep.eq({ key: "value", nested: { ok: "ok" } });
    });
    it("correctly skips some keys when stripping non-alphanumeric keys from an object", () => {
        const obj = {
            key: "value",
            "@at": "at",
            nested: { ok: "ok", "not!ok": 42 },
        };
        expect(stripNonAlphaNumericKeys(obj, /^@/)).to.deep.eq({ key: "value", "@at": "at", nested: { ok: "ok" } });
    });
});
