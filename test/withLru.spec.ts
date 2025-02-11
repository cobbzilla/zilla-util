import { expect } from "chai";
import { LRUCache, MockClock, withLRUCache } from "../lib/esm/index.js";

describe("withLRUCache", () => {
    let clock: MockClock;
    let cache: LRUCache<string, number>;
    let callCount: number;
    let slowFunction: (x: number) => number;
    let cachedFunction: (x: number) => number;

    beforeEach(() => {
        clock = new MockClock();
        cache = new LRUCache<string, number>(3, 100, clock);
        callCount = 0;
        slowFunction = (x: number) => {
            callCount++;
            return x * 2;
        };
        cachedFunction = withLRUCache(cache, slowFunction);
    });

    it("should cache function results and avoid duplicate calls", () => {
        expect(cachedFunction(2)).to.equal(4);
        expect(callCount).to.equal(1);
        expect(cachedFunction(2)).to.equal(4);
        expect(callCount).to.equal(1); // Should not call function again
    });

    it("should evict least recently used entries", () => {
        cachedFunction(1);
        cachedFunction(2);
        cachedFunction(3);
        cachedFunction(4); // Evicts "1"
        expect(cache.get("1")).to.be.undefined;
        expect(callCount).to.equal(4);
    });

    it("should expire entries based on maxAge", () => {
        cachedFunction(5);
        expect(callCount).to.equal(1);
        clock.advance(101); // Exceeds maxAge
        expect(cache.get("5")).to.be.undefined;
        expect(cachedFunction(5)).to.equal(10);
        expect(callCount).to.equal(2); // Function should be called again
    });

    it("should use a custom key function if provided", () => {
        const keyFn = (x: number) => `key-${x}`;
        const customCachedFunction = withLRUCache(cache, slowFunction, keyFn);
        expect(customCachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1);
        expect(customCachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1); // Cached result should be used
        expect(cache.get("key-3")).to.equal(6);
    });

    it("should handle functions with multiple arguments", () => {
        const multiArgFunction = (a: number, b: number) => {
            callCount++;
            return a + b;
        };
        const cachedMultiArgFunction = withLRUCache(cache, multiArgFunction);
        expect(cachedMultiArgFunction(2, 3)).to.equal(5);
        expect(callCount).to.equal(1);
        expect(cachedMultiArgFunction(2, 3)).to.equal(5);
        expect(callCount).to.equal(1); // Cached result should be used
    });

    it("should not call the target function when a cached value exists", () => {
        expect(cachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1);
        expect(cachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1); // Function should only be called once
    });
});
