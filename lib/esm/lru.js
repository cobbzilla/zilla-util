/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_CLOCK } from "zilla-util";
export class LRUCache {
    constructor({ maxSize = 100, maxAge, clock = DEFAULT_CLOCK, touchOnGet = true, logger } = {}) {
        if (maxSize <= 0)
            throw new Error("maxSize must be positive");
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.cache = new Map();
        this.clock = clock;
        this.touchOnGet = touchOnGet;
        this.logger = logger;
    }
    get(key) {
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.get(${key}) now=${this.clock.now()} starting`);
        }
        const entry = this.cache.get(key);
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.get(${key}) now=${this.clock.now()} entry=${entry ? JSON.stringify(entry) : "undefined"}`);
        }
        if (!entry) {
            return undefined;
        }
        if (this.maxAge !== undefined && this.clock.now() - entry.timestamp > this.maxAge) {
            if (this.logger && this.logger.isDebugEnabled()) {
                this.logger.debug(`LRUCache.get(${key}) now=${this.clock.now()} EXPIRED entry=${entry ? JSON.stringify(entry) : "undefined"}`);
            }
            this.cache.delete(key);
            return undefined;
        }
        if (this.touchOnGet) {
            if (this.logger && this.logger.isDebugEnabled()) {
                this.logger.debug(`LRUCache.get(${key}) now=${this.clock.now()} TOUCH-ON-GET entry=${entry ? JSON.stringify(entry) : "undefined"}`);
            }
            this.cache.delete(key);
            this.cache.set(key, { ...entry, timestamp: this.clock.now() });
        }
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.get(${key}) now=${this.clock.now()} RETURNING entry.value=${entry.value}`);
        }
        return entry.value;
    }
    set(key, value) {
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.set(${key}) now=${this.clock.now()} starting`);
        }
        if (this.cache.has(key)) {
            if (this.logger && this.logger.isDebugEnabled()) {
                this.logger.debug(`LRUCache.set(${key}) now=${this.clock.now()} KEY FOUND DELETING`);
            }
            this.cache.delete(key);
        }
        else if (this.cache.size >= this.maxSize) {
            if (this.logger && this.logger.isDebugEnabled()) {
                this.logger.debug(`LRUCache.set(${key}) now=${this.clock.now()} this.cache.size=${this.cache.size} >= this.maxSize=${this.maxSize} EVICTING`);
            }
            this.evict();
        }
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.set(${key}) now=${this.clock.now()} SETTING value=${JSON.stringify(value)}`);
        }
        this.cache.set(key, { value, timestamp: this.clock.now() });
    }
    evict() {
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.evict now=${this.clock.now()} starting`);
        }
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined) {
            if (this.logger && this.logger.isDebugEnabled()) {
                this.logger.debug(`LRUCache.evict now=${this.clock.now()} DELETING oldestKey=${oldestKey}`);
            }
            this.cache.delete(oldestKey);
        }
        else {
            if (this.logger && this.logger.isDebugEnabled()) {
                this.logger.debug(`LRUCache.evict now=${this.clock.now()} NOTHING TO DELETE oldestKey=undefined`);
            }
        }
    }
    delete(key) {
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.delete(${key}) now=${this.clock.now()} starting`);
        }
        this.cache.delete(key);
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.delete(${key}) now=${this.clock.now()} finished`);
        }
    }
    clear() {
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.clear now=${this.clock.now()} starting`);
        }
        this.cache.clear();
        if (this.logger && this.logger.isDebugEnabled()) {
            this.logger.debug(`LRUCache.clear now=${this.clock.now()} finished`);
        }
    }
}
export function withLRUCache(fn, cacheOrConfig, keyFn) {
    const cache = cacheOrConfig instanceof LRUCache ? cacheOrConfig : new LRUCache(cacheOrConfig);
    const defaultKeyFn = (...args) => JSON.stringify(args, (key, value) => (typeof value === "function" ? value.toString() : value));
    return (...args) => {
        const key = (keyFn ?? defaultKeyFn)(...args);
        const cachedValue = cache.get(key);
        if (cachedValue !== undefined)
            return cachedValue;
        const result = fn(...args);
        if (result instanceof Promise) {
            return result.then((resolvedResult) => {
                cache.set(key, resolvedResult);
                return resolvedResult;
            });
        }
        else {
            cache.set(key, result);
            return result;
        }
    };
}
//# sourceMappingURL=lru.js.map