import { describe, it } from "mocha";
import { expect } from "chai";
import {
    capitalize,
    uncapitalize,
    basefilename,
    basefilenameWithoutExt,
    camel2kebab,
    camel2snake,
    kebab2camel,
    snake2camel,
} from "../lib/esm/index.js";

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
