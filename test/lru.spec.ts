import { expect } from "chai";
import { LRUCache, MockClock } from "../lib/esm/index.js";

describe("LRUCache", () => {
    let clock: MockClock;
    let cache: LRUCache<string, number>;

    beforeEach(() => {
        clock = new MockClock();
        cache = new LRUCache<string, number>(3, 100, clock);
    });

    it("should store and retrieve values", () => {
        cache.set("a", 1);
        expect(cache.get("a")).to.equal(1);
    });

    it("should return undefined for non-existent keys", () => {
        expect(cache.get("missing")).to.be.undefined;
    });

    it("should evict least recently used items when maxSize is exceeded", () => {
        cache.set("a", 1);
        cache.set("b", 2);
        cache.set("c", 3);
        cache.set("d", 4); // This should evict "a"
        expect(cache.get("a")).to.be.undefined;
        expect(cache.get("b")).to.equal(2);
    });

    it("should expire old items based on maxAge", () => {
        cache.set("a", 1);
        clock.advance(101); // Exceeds maxAge
        expect(cache.get("a")).to.be.undefined;
    });

    it("should refresh an item's LRU status on access", () => {
        cache.set("a", 1);
        cache.set("b", 2);
        cache.set("c", 3);
        cache.get("a"); // Refresh "a"
        cache.set("d", 4); // Evict LRU, which should be "b"
        expect(cache.get("b")).to.be.undefined;
        expect(cache.get("a")).to.equal(1);
    });

    it("should delete specific keys", () => {
        cache.set("a", 1);
        cache.delete("a");
        expect(cache.get("a")).to.be.undefined;
    });

    it("should clear the cache", () => {
        cache.set("a", 1);
        cache.set("b", 2);
        cache.clear();
        expect(cache.get("a")).to.be.undefined;
        expect(cache.get("b")).to.be.undefined;
    });
});
