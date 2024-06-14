import { describe, it } from "mocha";
import { assert, expect } from "chai";
import { ERR_UNKNOWN_SUBST_CONTEXT_VAR, substContext, generateRandomString } from "../lib/esm/index.js";

describe("test string subst", () => {
    it("correctly substitutes strings in an object using a fixed context", () => {
        const var1value = "VAR-ONE";
        const var2value = "VAR_2222";
        const result = substContext(
            {
                key1: "{{ TEST_VAR_1 }}",
                nested: {
                    key2: "{{ TEST_VAR_2 }}",
                },
            },
            {
                TEST_VAR_1: var1value,
                TEST_VAR_2: var2value,
            }
        ) as any;
        expect(result.key1).to.equal(var1value);
        expect(result.nested.key2).to.equal(var2value);
    });

    it("correctly substitutes strings in an object using a functional context", () => {
        const randValue = generateRandomString(100);
        const randLength = Math.floor(Math.random() * randValue.length);

        const var2value = "VAR_2222";
        const result = substContext(
            {
                key1: `{{ rand ${randLength} }}`,
                key2: "{{ TEST_VAR_2 }}",
            },
            {
                rand: (args) => (args ? randValue.substring(0, parseInt(args[0])) : "null"),
                TEST_VAR_2: var2value,
            }
        ) as any;
        expect(result.key1).to.equal(randValue.substring(0, randLength));
        expect(result.key2).to.equal(var2value);
    });

    describe("missing context value in non-strict mode", () => {
        it("correctly substitutes strings in an object using a fixed context with default values", () => {
            const var1value = "VAR-ONE";
            const var2value = "VAR_2222";
            const var3value = "??VAR3";
            const result = substContext(
                {
                    key1: "{{ TEST_VAR_1 }}",
                    nested: {
                        key2: "{{ TEST_VAR_2 }}",
                        key3: "{{ VAR3 }}",
                    },
                },
                {
                    TEST_VAR_1: var1value,
                    TEST_VAR_2: var2value,
                    // VAR3: undefined
                },
                { strict: false }
            ) as any;
            expect(result.key1).to.equal(var1value);
            expect(result.nested.key2).to.equal(var2value);
            expect(result.nested.key3).to.equal(var3value);
        });
        it("correctly substitutes strings in an object using a fixed context with an undefined value", () => {
            const var1value = "VAR-ONE";
            const var2value = "VAR_2222";
            const var3value = "??VAR3";
            const result = substContext(
                {
                    key1: "{{ TEST_VAR_1 }}",
                    nested: {
                        key2: "{{ TEST_VAR_2 }}",
                        key3: "{{ VAR3 }}",
                    },
                },
                {
                    TEST_VAR_1: var1value,
                    TEST_VAR_2: var2value,
                    VAR3: undefined as any,
                },
                { strict: false }
            ) as any;
            expect(result.key1).to.equal(var1value);
            expect(result.nested.key2).to.equal(var2value);
            expect(result.nested.key3).to.equal(var3value);
        });
    });

    describe("missing context value in strict mode", () => {
        it("correctly throws an error in strict mode when a variable is missing", () => {
            try {
                const result = substContext(
                    {
                        key1: "{{ TEST_VAR_1 }}",
                    },
                    {},
                    { strict: true }
                );
                assert.fail(`expected substContext failure but returned: ${JSON.stringify(result)}`);
            } catch (e) {
                expect(e).instanceof(Error);
                expect((e as Error).message).include(ERR_UNKNOWN_SUBST_CONTEXT_VAR);
            }
        });
        it("correctly throws an error in default mode (strict mode) when a variable is missing", () => {
            try {
                const result = substContext(
                    {
                        key1: "{{ TEST_VAR_1 }}",
                    },
                    {}
                );
                assert.fail(`expected substContext failure but returned: ${JSON.stringify(result)}`);
            } catch (e) {
                expect(e).instanceof(Error);
                expect((e as Error).message).include(ERR_UNKNOWN_SUBST_CONTEXT_VAR);
            }
        });
    });
});
