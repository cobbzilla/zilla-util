export class LRUCache {
    constructor(maxSize, maxAge, clock) {
        if (maxSize <= 0 || maxAge <= 0)
            throw new Error("maxSize and maxAge must be positive");
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.cache = new Map();
        this.clock = clock;
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        if (this.clock.now() - entry.timestamp > this.maxAge) {
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
export function withLRUCache(cache, fn, keyFn) {
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