import { SortedSet } from "./array.js";

export type EmptyObjectType = Record<string, never>;

export const keysByValue = <K extends string, V>(obj: Record<K, V>, val: V): K[] => {
    return (Object.keys(obj) as K[]).filter((k) => obj[k] === val);
};

export const firstKeyByValue = <K extends string, V>(obj: Record<K, V>, val: V): K | undefined => {
    return (Object.keys(obj) as K[]).find((k) => obj[k] === val);
};

export const enumRecord = <E extends string | number | symbol, V>(
    e: Record<string, E>,
    init: V | ((e?: E) => V)
): Record<E, V> => {
    const o = {} as Record<E, V>;
    for (const k of Object.values(e) as E[]) {
        o[k] = typeof init === "function" ? (init as (e?: E) => V)(k) : init;
    }
    return o;
};

export const setsToArrays = <K extends string, V>(input: Record<K, SortedSet<V>>): Record<K, V[]> =>
    Object.fromEntries(Object.entries(input).map(([k, set]) => [k, (set as SortedSet<V>).toArray()])) as Record<K, V[]>;

export const findDuplicates = <T>(items: T[], field: keyof T): string[] => {
    const counts = new Map<string, number>();
    for (const item of items) {
        const key = String(item[field]);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts].filter(([, n]) => n > 1).map(([k]) => k);
};
