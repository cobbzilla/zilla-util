import { ZillaClock } from "zilla-util";
export declare class LRUCache<K, V> {
    private readonly maxSize;
    private readonly maxAge;
    private cache;
    private clock;
    constructor(maxSize: number, maxAge: number, clock: ZillaClock);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    private evict;
    delete(key: K): void;
    clear(): void;
}
export declare function withLRUCache<V>(cache: LRUCache<string, V>, fn: (...args: any[]) => V, keyFn?: (...args: any[]) => string): (...args: any[]) => V;
