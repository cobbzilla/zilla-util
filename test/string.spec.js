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
    it("correctly returns undefined when no argument passed", () => {
        expect(basefilename()).eq(undefined);
    });
    it("correctly returns undefined for undefined argument", () => {
        expect(basefilename(undefined)).eq(undefined);
    });
    it("correctly returns null for null argument", () => {
        expect(basefilename(null)).eq(null);
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
    it("correctly returns undefined when no argument passed", () => {
        expect(basefilenameWithoutExt()).eq(undefined);
    });
    it("correctly returns undefined for undefined argument", () => {
        expect(basefilenameWithoutExt(undefined)).eq(undefined);
    });
    it("correctly returns null for null argument", () => {
        expect(basefilenameWithoutExt(null)).eq(null);
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
