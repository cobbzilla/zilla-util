import { expect } from "chai";
import { LRUCache, MockClock, withLRUCache } from "../lib/esm/index.js";

describe("withLRUCache", () => {
    let clock: MockClock;
    let cache: LRUCache<string, number>;
    let callCount: number;
    let slowFunction: (x: number) => Promise<number>;
    let cachedFunction: (x: number) => Promise<number>;

    beforeEach(() => {
        clock = new MockClock();
        cache = new LRUCache({ maxSize: 3, maxAge: 100, clock });
        callCount = 0;
        slowFunction = async (x: number) => {
            callCount++;
            return x * 2;
        };
        cachedFunction = withLRUCache(slowFunction, cache);
    });

    it("should cache function results and avoid duplicate calls", async () => {
        expect(await cachedFunction(2)).to.equal(4);
        expect(callCount).to.equal(1);
        expect(await cachedFunction(2)).to.equal(4);
        expect(callCount).to.equal(1); // Should not call function again
    });

    it("should evict least recently used entries", async () => {
        await cachedFunction(1);
        await cachedFunction(2);
        await cachedFunction(3);
        await cachedFunction(4); // Evicts "1"
        expect(cache.get("1")).to.be.undefined;
        expect(callCount).to.equal(4);
    });

    it("should expire entries based on maxAge", async () => {
        await cachedFunction(5);
        expect(callCount).to.equal(1);
        clock.advance(101); // Exceeds maxAge
        expect(cache.get("5")).to.be.undefined;
        expect(await cachedFunction(5)).to.equal(10);
        expect(callCount).to.equal(2); // Function should be called again
    });

    it("should use a custom key function if provided", async () => {
        const keyFn = (x: number) => `key-${x}`;
        const customCachedFunction = withLRUCache(slowFunction, cache, keyFn);
        expect(await customCachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1);
        expect(await customCachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1); // Cached result should be used
        expect(cache.get("key-3")).to.equal(6);
    });

    it("should handle functions with multiple arguments", async () => {
        const multiArgFunction = async (a: number, b: number) => {
            callCount++;
            return a + b;
        };
        const cachedMultiArgFunction = withLRUCache(multiArgFunction, cache);
        expect(await cachedMultiArgFunction(2, 3)).to.equal(5);
        expect(callCount).to.equal(1);
        expect(await cachedMultiArgFunction(2, 3)).to.equal(5);
        expect(callCount).to.equal(1); // Cached result should be used
    });

    it("should not call the target function when a cached value exists", async () => {
        expect(await cachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1);
        expect(await cachedFunction(3)).to.equal(6);
        expect(callCount).to.equal(1); // Function should only be called once
    });

    it("should use default maxSize if not provided", () => {
        const defaultCache = new LRUCache({ clock });
        expect(defaultCache).to.have.property("maxSize", 100);
    });

    it("should allow no expiration if maxAge is not provided", async () => {
        const defaultCache = new LRUCache({ maxSize: 3, clock });
        const testFunction = withLRUCache(slowFunction, defaultCache);
        await testFunction(10);
        clock.advance(1000);
        expect(await testFunction(10)).to.equal(20);
        expect(callCount).to.equal(1); // Function should not be called again
    });
    it("should cache results for synchronous functions", () => {
        let syncCallCount = 0;
        const syncFunction = (x: number) => {
            syncCallCount++;
            return x * 2;
        };
        const cachedSyncFunction = withLRUCache(syncFunction, cache);

        expect(cachedSyncFunction(2)).to.equal(4);
        expect(syncCallCount).to.equal(1);
        expect(cachedSyncFunction(2)).to.equal(4);
        expect(syncCallCount).to.equal(1); // Cached result should be used
    });
});
