import { ZillaClock } from "zilla-util";
interface LRUCacheConfig {
    maxSize?: number;
    maxAge?: number;
    clock?: ZillaClock;
}
export declare class LRUCache<K, V> {
    private readonly maxSize;
    private readonly maxAge?;
    private cache;
    private clock;
    constructor({ maxSize, maxAge, clock }?: LRUCacheConfig);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    private evict;
    delete(key: K): void;
    clear(): void;
}
export declare function withLRUCache<V>(fn: (...args: any[]) => V, keyFn?: (...args: any[]) => string, cacheOrConfig?: LRUCache<string, V> | LRUCacheConfig): (...args: any[]) => V;
export {};
