/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_CLOCK } from "zilla-util";
export class LRUCache {
    constructor({ maxSize = 100, maxAge, clock = DEFAULT_CLOCK } = {}) {
        if (maxSize <= 0)
            throw new Error("maxSize must be positive");
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.cache = new Map();
        this.clock = clock;
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        if (this.maxAge !== undefined && this.clock.now() - entry.timestamp > this.maxAge) {
            this.cache.delete(key);
            return undefined;
        }
        this.cache.delete(key);
        this.cache.set(key, { ...entry, timestamp: this.clock.now() });
        return entry.value;
    }
    set(key, value) {
        if (this.cache.has(key))
            this.cache.delete(key);
        else if (this.cache.size >= this.maxSize)
            this.evict();
        this.cache.set(key, { value, timestamp: this.clock.now() });
    }
    evict() {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined)
            this.cache.delete(oldestKey);
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
}
export function withLRUCache(fn, keyFn, cacheOrConfig) {
    const cache = cacheOrConfig instanceof LRUCache ? cacheOrConfig : new LRUCache(cacheOrConfig);
    const defaultKeyFn = (...args) => JSON.stringify(args, (key, value) => (typeof value === "function" ? value.toString() : value));
    return (...args) => {
        const key = (keyFn ?? defaultKeyFn)(...args);
        const cachedValue = cache.get(key);
        if (cachedValue !== undefined)
            return cachedValue;
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}
//# sourceMappingURL=lru.js.map