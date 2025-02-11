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
        cache = new LRUCache({ maxSize: 3, maxAge: 100, clock });
        callCount = 0;
        slowFunction = (x: number) => {
            callCount++;
            return x * 2;
        };
        cachedFunction = withLRUCache(slowFunction, cache);
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
        const customCachedFunction = withLRUCache(slowFunction, cache, keyFn);
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
        const cachedMultiArgFunction = withLRUCache(multiArgFunction, cache);
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

    it("should use default maxSize if not provided", () => {
        const defaultCache = new LRUCache({ clock });
        expect(defaultCache).to.have.property("maxSize", 100);
    });

    it("should allow no expiration if maxAge is not provided", () => {
        const defaultCache = new LRUCache({ maxSize: 3, clock });
        const testFunction = withLRUCache(slowFunction, defaultCache);
        testFunction(10);
        clock.advance(1000);
        expect(testFunction(10)).to.equal(20);
        expect(callCount).to.equal(1); // Function should not be called again
    });
});
