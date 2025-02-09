import { describe, it } from "mocha";
import { expect } from "chai";
import {
    sluggize,
    hyphenate,
    capitalize,
    uncapitalize,
    basefilename,
    basefilenameWithoutExt,
    ext,
    camel2kebab,
    camel2snake,
    kebab2camel,
    snake2camel,
    hasUpperCase,
    sortWords,
    randomDigit,
    randomDigits,
    trimSpaces,
    trimNonalphanumeric,
    sortObj,
    sortedStringify,
    packageVersion,
    REGEX_ARRAY_OF_FLOATS,
    REGEX_ARRAY_OF_STRINGS,
} from "../lib/esm/index.js";

describe("test sluggize", () => {
    it("correctly sluggizes a regular string with spaces", () => {
        expect(sluggize("this is a sluggized string")).eq("this_is_a_sluggized_string");
    });
    it("correctly sluggizes (with hyphens) a regular string with spaces", () => {
        expect(sluggize("this is a sluggized string", "-")).eq("this-is-a-sluggized-string");
        expect(hyphenate("this is a sluggized string")).eq("this-is-a-sluggized-string");
    });
    it("correctly sluggizes an odd string with spaces", () => {
        expect(sluggize("  This is #1 great!    Thank you. ")).eq("this_is_1_great_thank_you");
    });
    it("correctly sluggizes (with hyphens) an odd string with spaces", () => {
        expect(sluggize("  This is #1 great!    Thank you. ", "-")).eq("this-is-1-great-thank-you");
        expect(hyphenate("  This is #1 great!    Thank you. ")).eq("this-is-1-great-thank-you");
    });
});

describe("test capitalization", () => {
    it("correctly capitalizes a lowercase word", () => {
        expect(capitalize("fooBar")).eq("FooBar");
    });
    it("correctly capitalizes (does nothing) when a word is already capitalized", () => {
        expect(capitalize("FooBar")).eq("FooBar");
    });
    it("correctly uncapitalizes a capitalized word", () => {
        expect(uncapitalize("FooBar")).eq("fooBar");
    });
    it("correctly uncapitalizes (does nothing) when a word is already lowercase", () => {
        expect(uncapitalize("fooBar")).eq("fooBar");
    });
});

describe("test basefilename", () => {
    it("correctly finds the basename for an absolute path", () => {
        expect(basefilename("/foo/bar/baz")).eq("baz");
    });
    it("correctly finds the basename for a relative path", () => {
        expect(basefilename("foo/bar/baz")).eq("baz");
    });
    it("correctly finds the basename for a plain filename", () => {
        expect(basefilename("foo")).eq("foo");
    });
    it("correctly finds the basename for an absolute path that ends with a slash", () => {
        expect(basefilename("/foo/bar/baz/")).eq("baz");
    });
    it("correctly finds the basename for a relative path that ends with a slash", () => {
        expect(basefilename("foo/bar/baz/")).eq("baz");
    });
    it("correctly finds the basename for a filename that ends with a slash", () => {
        expect(basefilename("foo/")).eq("foo");
    });
    it("correctly returns undefined for undefined argument", () => {
        expect(basefilename(undefined as any)).eq(undefined);
    });
    it("correctly returns null for null argument", () => {
        expect(basefilename(null as any)).eq(null);
    });
    it("correctly returns empty string for empty string argument", () => {
        expect(basefilename("")).eq("");
    });
    it("correctly returns empty string for all-slashes argument", () => {
        expect(basefilename("///")).eq("");
    });
});

describe("test basefilenameWithoutExt", () => {
    it("correctly finds the basename without extension for an absolute path", () => {
        expect(basefilenameWithoutExt("/foo/bar/baz.quux")).eq("baz");
    });
    it("correctly finds the basename for a relative path", () => {
        expect(basefilenameWithoutExt("foo/bar/baz.quux")).eq("baz");
    });
    it("correctly finds the basename for a plain filename", () => {
        expect(basefilenameWithoutExt("foo.quux")).eq("foo");
    });
    it("correctly finds the basename for an absolute path that ends with a slash", () => {
        expect(basefilenameWithoutExt("/foo/bar/baz.quux/")).eq("baz");
    });
    it("correctly finds the basename for a relative path that ends with a slash", () => {
        expect(basefilenameWithoutExt("foo/bar/baz.quux/")).eq("baz");
    });
    it("correctly finds the basename for a filename that ends with a slash", () => {
        expect(basefilenameWithoutExt("foo.quux/")).eq("foo");
    });
    it("correctly returns undefined for undefined argument", () => {
        expect(basefilenameWithoutExt(undefined as any)).eq(undefined);
    });
    it("correctly returns null for null argument", () => {
        expect(basefilenameWithoutExt(null as any)).eq(null);
    });
    it("correctly returns empty string for empty string argument", () => {
        expect(basefilenameWithoutExt("")).eq("");
    });
    it("correctly returns empty string for all-slashes argument", () => {
        expect(basefilenameWithoutExt("///")).eq("");
    });
    it("correctly finds the basename for a filename with multiple dots", () => {
        expect(basefilenameWithoutExt("foo.bar.baz.quux")).eq("foo.bar.baz");
    });
    it("correctly finds the basename for a filename with no dots", () => {
        expect(basefilenameWithoutExt("foo")).eq("foo");
    });
    it("correctly finds the basename for a filename ending with dots", () => {
        expect(basefilenameWithoutExt("foo...")).eq("foo");
    });
    it("correctly finds the basename for a filename with multiple dots and ending in dots", () => {
        expect(basefilenameWithoutExt("foo.bar.baz.quux...")).eq("foo.bar.baz");
    });
});

describe("ext test", () => {
    it("correctly finds the extension for a regular file", () => {
        expect(ext("foo.bar")).eq("bar");
    });
    it("correctly returns an empty extension for a file that does not contain a dot", () => {
        expect(ext("foo_bar")).eq("");
    });
    it("correctly returns an empty extension for a file that ends with a dot", () => {
        expect(ext("foo_bar.")).eq("");
    });
    it("correctly returns an empty extension for a file that starts with a dot", () => {
        expect(ext(".foo_bar")).eq("foo_bar");
    });
    it("correctly returns an empty extension for a file that starts and ends with a dot", () => {
        expect(ext(".foo_bar.")).eq("");
    });
    it("correctly returns an empty extension for a file that starts and ends with a dot and contains dots", () => {
        expect(ext(".foo.bar.baz.")).eq("");
    });
    it("correctly returns an empty extension for a file that starts with a dot and contains dots", () => {
        expect(ext(".foo.bar.baz")).eq("baz");
    });
    it("correctly returns an empty extension for a file that contains dots", () => {
        expect(ext("foo.bar.baz.quux")).eq("quux");
    });
});

describe("camelCase, kebab-case and snake_case utility test", () => {
    it("correctly transforms from camelCase to kebab-case", () => {
        expect(camel2kebab("camelCaseString")).eq("camel-case-string");
    });
    it("correctly transforms from kebab-case to camelCase", () => {
        expect(kebab2camel("kebab-case-string")).eq("kebabCaseString");
    });
    it("correctly transforms from camelCase to snake_case", () => {
        expect(camel2snake("camelCaseString")).eq("camel_case_string");
    });
    it("correctly transforms from snake_case to camelCase", () => {
        expect(snake2camel("snake_case_string")).eq("snakeCaseString");
    });
});

describe("hasUpperCase test", () => {
    it("correctly returns true when an upper case character is present", () => {
        expect(hasUpperCase("camelCaseString")).eq(true);
    });
    it("correctly returns false when an upper case character is absent", () => {
        expect(hasUpperCase("snake-case-string")).eq(false);
    });
});

describe("sortWords test", () => {
    it("correctly sorts words", () => {
        const words = ["apple", "banana", "cherry", "date"];
        const dict = ["date", "banana", "apple", "cherry"];
        const expectedResults = ["date", "banana", "apple", "cherry"];
        const result = sortWords(words, dict);
        expect(result).to.deep.equal(expectedResults);
    });
});

describe("randomDigit test", () => {
    it("correctly generates a randomDigit", () => {
        for (let i = 0; i < 10; i++) {
            const digit = randomDigit();
            expect(digit).to.be.lessThanOrEqual(9);
            expect(digit).to.be.greaterThanOrEqual(0);
        }
    });
    it("correctly generates a randomDigit in a range", () => {
        for (let i = 0; i < 10; i++) {
            const lower = randomDigit();
            const upper = randomDigit(lower);
            expect(upper).to.be.greaterThanOrEqual(lower);

            const digit = randomDigit(lower, upper);
            expect(digit).to.be.lessThanOrEqual(upper);
            expect(digit).to.be.greaterThanOrEqual(lower);
        }
    });
    it("correctly generates a randomDigit in the range 0..0", () => {
        for (let i = 0; i < 10; i++) {
            const digit = randomDigit(0, 0);
            expect(digit).to.equal(0);
        }
    });
});

describe("randomDigits test", () => {
    it("correctly generates a string of randomDigits", () => {
        for (let i = 0; i < 10; i++) {
            const digits = randomDigits(i);
            expect(digits.length).to.equal(i);
            for (let j = 0; j < i; j++) {
                expect(parseInt(digits[j])).to.be.greaterThanOrEqual(0);
                expect(parseInt(digits[j])).to.be.lessThanOrEqual(9);
            }
        }
    });
    it("correctly generates a string of randomDigits in a range", () => {
        for (let i = 0; i < 10; i++) {
            const lower = randomDigit();
            const upper = randomDigit(lower);
            expect(upper).to.be.greaterThanOrEqual(lower);

            const digits = randomDigits(i, lower, upper);
            expect(digits.length).to.equal(i);
            for (let j = 0; j < i; j++) {
                expect(parseInt(digits[j])).to.be.greaterThanOrEqual(lower);
                expect(parseInt(digits[j])).to.be.lessThanOrEqual(upper);
            }
        }
    });
    it("correctly generates a string of randomDigits in the range 0..0", () => {
        for (let i = 0; i < 10; i++) {
            const digits = randomDigits(i, 0, 0);
            expect(digits.length).to.equal(i);
            for (let j = 0; j < i; j++) {
                expect(parseInt(digits[j])).to.equal(0);
            }
        }
    });
});

describe("trimSpaces test", () => {
    it("correctly trims spaces from a string", () => {
        const testString = "  leading   and   embedded and trailing spaces   ";
        expect(trimSpaces(testString)).to.equal("leading and embedded and trailing spaces");
    });
});

describe("trimNonalphanumeric test", () => {
    it("correctly trims non-alphanumeric characters from a string", () => {
        const testString = " #123  and some words ";
        expect(trimNonalphanumeric(testString)).to.equal("123andsomewords");
    });
});

describe("sortObj and sortedStringify test", () => {
    it("correctly sorts and stringifies properties in a nested object", () => {
        const obj = { zzz: 123, nested: { foo: 1, bar: 2 }, key1: "value1", key2: "value2", aaa: 456 };
        const sorted = sortObj(obj);
        expect(JSON.stringify(sorted)).eq(
            '{"aaa":456,"key1":"value1","key2":"value2","nested":{"bar":2,"foo":1},"zzz":123}'
        );
        expect(sortedStringify(obj)).eq(JSON.stringify(sorted));
    });
});

describe("regex for array of strings test", () => {
    const stringArrayRegex = REGEX_ARRAY_OF_STRINGS;

    const validCases = [
        '["apple"]',
        '["apple", "banana"]',
        '["a", "b", "c"]',
        '["hello world", "123", "foo bar"]',
        '[""]',
        '["one", "two", "three", "four"]',
    ];

    const invalidCases = [
        '["apple",]', // Trailing comma (invalid JSON)
        '["apple", banana]', // Missing double quotes around "banana"
        '[123, "banana"]', // Contains a non-string value
        '"apple"', // Not an array
        "[apple]", // No quotes around string
        '["one" "two"]', // Missing comma between values
        '["hello, world"]]', // Extra closing bracket
        '["hello]"', // Unescaped quote inside string
        '[""] ""]', // Extra data outside brackets
        '["first", "second", , "fourth"]', // Missing value between commas
    ];

    validCases.forEach((testCase) => {
        it(`should match valid string array: ${testCase}`, () => {
            expect(stringArrayRegex.test(testCase)).to.be.true;
        });
    });

    invalidCases.forEach((testCase) => {
        it(`should not match invalid string array: ${testCase}`, () => {
            expect(stringArrayRegex.test(testCase)).to.be.false;
        });
    });
});

describe("regex for array of floats test", () => {
    const floatArrayRegex = REGEX_ARRAY_OF_FLOATS;

    const validCases = [
        "[1.23]",
        "[-3.14, 0.0, 42, 100.5]",
        "[1.23e10, -4.56E-2, 3.0E+5]",
        "[0.5, -0.001, 1.2e3]",
        "[10, -20.5, 3E8]",
    ];

    const invalidCases = [
        '[1, "2.3", 4]', // Contains a string
        "[3.14, .5, 1]", // Invalid `.5`, should be `0.5`
        "[2e, 4]", // Missing exponent digits
        "[,1.23]", // Leading comma
        "[1.23,]", // Trailing comma
        "[1.2.3]", // Multiple decimal points
        "[e10]", // Only exponent
        "[1e+]", // Missing exponent digits
        "1.23, 4.56", // Not an array
        "[1.2, 3.4", // Missing closing bracket
        "1.2, 3.4]", // Missing opening bracket
    ];

    validCases.forEach((testCase) => {
        it(`should match valid float array: ${testCase}`, () => {
            expect(floatArrayRegex.test(testCase)).to.be.true;
        });
    });

    invalidCases.forEach((testCase) => {
        it(`should not match invalid float array: ${testCase}`, () => {
            expect(floatArrayRegex.test(testCase)).to.be.false;
        });
    });
});
describe("gets the package version", () => {
    it("retrieves our own package version", async () => {
        const version = await packageVersion();
        expect(version).is.not.null;
        expect(version).is.not.undefined;
        expect(version.length).is.gte(5);
    });
});
