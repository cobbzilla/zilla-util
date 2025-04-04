import { ZillaClock } from "zilla-util";
import { GenericLogger } from "./logger.js";
export interface LRUCacheConfig {
    maxSize?: number;
    maxAge?: number;
    clock?: ZillaClock;
    touchOnGet?: boolean;
    logger?: GenericLogger;
}
export declare class LRUCache<K, V> {
    private readonly maxSize;
    private readonly maxAge?;
    private cache;
    private clock;
    private touchOnGet?;
    private logger?;
    constructor({ maxSize, maxAge, clock, touchOnGet, logger }?: LRUCacheConfig);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    private evict;
    delete(key: K): void;
    clear(): void;
}
export declare function withLRUCache<V>(fn: (...args: any[]) => Promise<V>, cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig, keyFn?: (...args: any[]) => string): (...args: any[]) => Promise<V>;
export declare function withLRUCache<V>(fn: (...args: any[]) => V, cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig, keyFn?: (...args: any[]) => string): (...args: any[]) => V;
