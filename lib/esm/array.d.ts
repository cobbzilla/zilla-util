export declare const setsEqual: <T>(a: T[], b: T[]) => boolean;
export declare const cartesianProduct: <T>(arr: T[][]) => T[][];
export declare const isAnyTrue: <T extends boolean[]>(arr: T) => boolean;
export declare const insertAfterElement: <T>(sourceArray: T[], targetArray: T[], element: T) => T[];
export declare const asyncFilter: <T>(arr: T[], predicate: (item: T) => Promise<boolean>) => Promise<T[]>;
export declare const shuffleArray: <T>(array: T[]) => T[];
export declare const shuffleNumbers: (n: number) => number[];
export declare const deduplicateArrayByName: (entries: Record<string, unknown>[]) => Record<string, unknown>[];
export declare const deduplicateArray: (entries: Record<string, unknown>[], field: string) => Record<string, unknown>[];
export declare class SortedSet<T> {
    private items;
    private comparator;
    constructor(comparator: (a: T, b: T) => number);
    add(value: T): void;
    delete(value: T): boolean;
    has(value: T): boolean;
    toArray(): T[];
}
export declare class SortedIdSet<T, ID> extends SortedSet<T> {
    private ids;
    private id;
    constructor(comparator: (a: T, b: T) => number, id: (a: T) => ID);
    add(value: T): void;
    delete(value: T): boolean;
    has(value: T): boolean;
}
export declare const firstByProperty: <T extends Record<string, unknown>>(items: T[], prop: keyof T) => T[];
