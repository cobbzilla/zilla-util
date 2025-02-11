/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZillaClock, DEFAULT_CLOCK } from "zilla-util";

export interface LRUCacheConfig {
    maxSize?: number;
    maxAge?: number;
    clock?: ZillaClock;
}

export class LRUCache<K, V> {
    private readonly maxSize: number;
    private readonly maxAge?: number;
    private cache: Map<K, { value: V; timestamp: number }>;
    private clock: ZillaClock;

    constructor({ maxSize = 100, maxAge, clock = DEFAULT_CLOCK }: LRUCacheConfig = {}) {
        if (maxSize <= 0) throw new Error("maxSize must be positive");
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.cache = new Map();
        this.clock = clock;
    }

    get(key: K): V | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;

        if (this.maxAge !== undefined && this.clock.now() - entry.timestamp > this.maxAge) {
            this.cache.delete(key);
            return undefined;
        }

        this.cache.delete(key);
        this.cache.set(key, { ...entry, timestamp: this.clock.now() });
        return entry.value;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) this.cache.delete(key);
        else if (this.cache.size >= this.maxSize) this.evict();

        this.cache.set(key, { value, timestamp: this.clock.now() });
    }

    private evict(): void {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }

    delete(key: K): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export function withLRUCache<V>(
    fn: (...args: any[]) => V,
    keyFn?: (...args: any[]) => string,
    cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig
): (...args: any[]) => V {
    const cache = cacheOrConfig instanceof LRUCache ? cacheOrConfig : new LRUCache<string, V>(cacheOrConfig);

    const defaultKeyFn = (...args: any[]): string =>
        JSON.stringify(args, (key, value) => (typeof value === "function" ? value.toString() : value));

    return (...args: any[]): V => {
        const key = (keyFn ?? defaultKeyFn)(...args);
        const cachedValue = cache.get(key);
        if (cachedValue !== undefined) return cachedValue;

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}
