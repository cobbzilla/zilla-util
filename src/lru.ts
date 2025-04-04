/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZillaClock, DEFAULT_CLOCK } from "zilla-util";
import { GenericLogger } from "./logger.js";

export interface LRUCacheConfig {
    maxSize?: number;
    maxAge?: number;
    clock?: ZillaClock;
    touchOnGet?: boolean;
    logger?: GenericLogger;
}

export class LRUCache<K, V> {
    private readonly maxSize: number;
    private readonly maxAge?: number;
    private cache: Map<K, { value: V; timestamp: number }>;
    private clock: ZillaClock;
    private touchOnGet?: boolean;
    private logger?: GenericLogger;

    constructor({ maxSize = 100, maxAge, clock = DEFAULT_CLOCK, touchOnGet = true, logger }: LRUCacheConfig = {}) {
        if (maxSize <= 0) throw new Error("maxSize must be positive");
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.cache = new Map();
        this.clock = clock;
        this.touchOnGet = touchOnGet;
        this.logger = logger;
        if (this.logger && this.logger.isTraceEnabled()) {
            if (clock.constructor) {
                this.logger.trace(`LRUCache.constructor now=${this.clock.now()} using clock=${clock.constructor}`);
            } else {
                this.logger.trace(
                    `LRUCache.constructor now=${this.clock.now()} using clock=${
                        clock === DEFAULT_CLOCK ? "DEFAULT_CLOCK" : "custom-clock"
                    }`
                );
            }
        }
    }

    get(key: K): V | undefined {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.get(${key}) now=${this.clock.now()} starting`);
        }
        const entry = this.cache.get(key);
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(
                `LRUCache.get(${key}) now=${this.clock.now()} entry=${entry ? JSON.stringify(entry) : "undefined"}`
            );
        }
        if (!entry) {
            return undefined;
        }

        if (this.maxAge !== undefined && this.clock.now() - entry.timestamp > this.maxAge) {
            if (this.logger && this.logger.isTraceEnabled()) {
                this.logger.trace(
                    `LRUCache.get(${key}) now=${this.clock.now()} EXPIRED entry=${
                        entry ? JSON.stringify(entry) : "undefined"
                    }`
                );
            }
            this.cache.delete(key);
            return undefined;
        }

        if (this.touchOnGet) {
            if (this.logger && this.logger.isTraceEnabled()) {
                this.logger.trace(
                    `LRUCache.get(${key}) now=${this.clock.now()} TOUCH-ON-GET entry=${
                        entry ? JSON.stringify(entry) : "undefined"
                    }`
                );
            }
            this.cache.delete(key);
            this.cache.set(key, { ...entry, timestamp: this.clock.now() });
        }
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.get(${key}) now=${this.clock.now()} RETURNING entry.value=${entry.value}`);
        }
        return entry.value;
    }

    set(key: K, value: V): void {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.set(${key}) now=${this.clock.now()} starting`);
        }
        if (this.cache.has(key)) {
            if (this.logger && this.logger.isTraceEnabled()) {
                this.logger.trace(`LRUCache.set(${key}) now=${this.clock.now()} KEY FOUND DELETING`);
            }
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            if (this.logger && this.logger.isTraceEnabled()) {
                this.logger.trace(
                    `LRUCache.set(${key}) now=${this.clock.now()} this.cache.size=${this.cache.size} >= this.maxSize=${
                        this.maxSize
                    } EVICTING`
                );
            }
            this.evict();
        }
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.set(${key}) now=${this.clock.now()} SETTING value=${JSON.stringify(value)}`);
        }
        this.cache.set(key, { value, timestamp: this.clock.now() });
    }

    private evict(): void {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.evict now=${this.clock.now()} starting`);
        }
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined) {
            if (this.logger && this.logger.isTraceEnabled()) {
                this.logger.trace(`LRUCache.evict now=${this.clock.now()} DELETING oldestKey=${oldestKey}`);
            }
            this.cache.delete(oldestKey);
        } else {
            if (this.logger && this.logger.isTraceEnabled()) {
                this.logger.trace(`LRUCache.evict now=${this.clock.now()} NOTHING TO DELETE oldestKey=undefined`);
            }
        }
    }

    delete(key: K): void {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.delete(${key}) now=${this.clock.now()} starting`);
        }
        this.cache.delete(key);
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.delete(${key}) now=${this.clock.now()} finished`);
        }
    }

    clear(): void {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.clear now=${this.clock.now()} starting`);
        }
        this.cache.clear();
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`LRUCache.clear now=${this.clock.now()} finished`);
        }
    }
}

export function withLRUCache<V>(
    fn: (...args: any[]) => Promise<V>,
    cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig,
    keyFn?: (...args: any[]) => string
): (...args: any[]) => Promise<V>;

export function withLRUCache<V>(
    fn: (...args: any[]) => V,
    cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig,
    keyFn?: (...args: any[]) => string
): (...args: any[]) => V;

export function withLRUCache<V>(
    fn: (...args: any[]) => V | Promise<V>,
    cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig,
    keyFn?: (...args: any[]) => string
): (...args: any[]) => V | Promise<V> {
    const cache = cacheOrConfig instanceof LRUCache ? cacheOrConfig : new LRUCache<string, V>(cacheOrConfig);

    const defaultKeyFn = (...args: any[]): string =>
        JSON.stringify(args, (key, value) => (typeof value === "function" ? value.toString() : value));

    return (...args: any[]): V | Promise<V> => {
        const key = (keyFn ?? defaultKeyFn)(...args);
        const cachedValue = cache.get(key);
        if (cachedValue !== undefined) return cachedValue;

        const result = fn(...args);
        if (result instanceof Promise) {
            return result.then((resolvedResult) => {
                cache.set(key, resolvedResult);
                return resolvedResult;
            });
        } else {
            cache.set(key, result);
            return result;
        }
    };
}
