import { describe, it } from "mocha";
import { expect } from "chai";
import { capitalize, uncapitalize, basefilename } from "../lib/esm/index.js";

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
});
