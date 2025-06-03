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
    countVisibleChars,
    kebab2camel,
    snake2camel,
    hasUpperCase,
    sortWords,
    randomDigit,
    randomDigits,
    trimSpaces,
    trimNonalphanumeric,
    safeStringify,
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

type CircularObject = {
    ref: object;
}

const circle: CircularObject = {
    ref: {}
};

circle.ref = circle;

describe("safeStringify", () => {
    it("fails to JSON.stringify a circular object", () => {
        try {
            JSON.stringify(circle);
        } catch (e) {
            expect(e).to.be.instanceof(Error);
            expect((e as Error).constructor.name).eq("TypeError");
            expect((e as Error).message).includes("circular");
        }
    })
    it("succeeds in using safeStringify on a circular object", () => {
        const safe = safeStringify(circle);
        expect(safe).to.be.eq("{\"ref\":\"[Circular]\"}")
    })
})

describe("countVisibleChars", () => {
    it("counts visible characters correctly", () => {
        expect(countVisibleChars("abc")).to.be.eq(3);
    })
    it("returns 0 for an empty string", (): void => {
        expect(countVisibleChars("")).to.equal(0);
    });
    it("counts simple ASCII characters correctly", (): void => {
        expect(countVisibleChars("abc")).to.equal(3);
    });
    it("treats a single combining sequence (e + ◌́) as one cluster", (): void => {
        const eAcute = "e\u0301";
        expect(countVisibleChars(eAcute)).to.equal(1);
    });
    it("counts a letter plus multiple combining marks as one cluster", (): void => {
        const base = "x";
        const combining = "\u0300\u0301\u0302\u0303\u0304"; // grave, acute, circumflex, tilde, macron
        expect(countVisibleChars(base + combining)).to.equal(1);
    });
    it("counts a high-surrogate/low-surrogate pair (a musical symbol) as one", (): void => {
        const musicalGclef = "\uD834\uDD1E"; // U+1D11E
        expect(countVisibleChars(musicalGclef)).to.equal(1);
    });
    it("counts a flag (regional indicator symbols) as one cluster", (): void => {
        const flagUS = "🇺🇸"; // 🇺 (U+1F1FA) + 🇸 (U+1F1F8)
        expect(countVisibleChars(flagUS)).to.equal(1);
    });
    it("counts an emoji with skin-tone modifier as one cluster", (): void => {
        const thumbsUpMedium = "👍🏽"; // 👍 (U+1F44D) + 🏽 (U+1F3FD)
        expect(countVisibleChars(thumbsUpMedium)).to.equal(1);
    });
    it("counts a ZWJ sequence for a family emoji as one cluster", (): void => {
        const family = "👩‍👩‍👧‍👦"; // woman + ZWJ + woman + ZWJ + girl + ZWJ + boy
        expect(countVisibleChars(family)).to.equal(1);
    });
    it("counts a ZWJ sequence for a kiss emoji as one cluster", (): void => {
        const kiss = "👩‍❤️‍💋‍👩"; // woman + ZWJ + ❤️ + ZWJ + 💋 + ZWJ + woman
        expect(countVisibleChars(kiss)).to.equal(1);
    });
    it("counts a keycap sequence as one cluster", (): void => {
        const keycapOne = "1️⃣"; // "1" + VS16 + COMBINING ENCLOSING KEYCAP
        expect(countVisibleChars(keycapOne)).to.equal(1);
    });
    it("counts variation selector usage consistently", (): void => {
        const victoryHandPlain = "✌"; // U+270C
        const victoryHandVS = "✌️"; // U+270C + U+FE0F
        expect(countVisibleChars(victoryHandPlain)).to.equal(1);
        expect(countVisibleChars(victoryHandVS)).to.equal(1);
    });
    it("counts separated emoji and letters correctly", (): void => {
        const mixed = "a👩‍👩‍👧‍👦b";
        expect(countVisibleChars(mixed)).to.equal(3);
    });
    it("handles multiple separate ZWJ sequences", (): void => {
        const seq = "👨‍👩‍👦👩‍👧"; // family+ZWJ+child then woman+ZWJ+girl
        expect(countVisibleChars(seq)).to.equal(2);
    });
    it("counts surrogate pairs and combining marks mixed", (): void => {
        const mix = "\uD83D\uDC36\u0301"; // 🐶 (dog face) + ◌́
        // Dog face is one cluster, + combining acute attach makes that one cluster
        expect(countVisibleChars(mix)).to.equal(1);
    });
    it("counts multiple separate combining clusters", (): void => {
        const a1 = "a\u0301"; // a + ◌́
        const e2 = "e\u0300"; // e + ◌̀
        expect(countVisibleChars(a1 + e2)).to.equal(2);
    });
    it("handles pathological long combining sequences", (): void => {
        const base = "Z";
        const longCombining = "\u0300".repeat(50); // 50 grave accents
        expect(countVisibleChars(base + longCombining)).to.equal(1);
    });
    it("handles ZWJ sequences with text fallback", (): void => {
        // a random sequence that looks like ZWJ but is plain text
        const textZWJ = "a\u200Da"; // "a" + ZWJ + "a"
        // This is two graphemes because ZWJ between letters doesn’t merge them
        expect(countVisibleChars(textZWJ)).to.equal(2);
    });
})
