import { SortedSet } from "./array.js";
export type EmptyObjectType = Record<string, never>;
export declare const keysByValue: <K extends string, V>(obj: Record<K, V>, val: V) => K[];
export declare const firstKeyByValue: <K extends string, V>(obj: Record<K, V>, val: V) => K | undefined;
export declare const enumRecord: <E extends string | number | symbol, V>(e: Record<string, E>, init: V | ((e?: E) => V)) => Record<E, V>;
export declare const setsToArrays: <K extends string, V>(input: Record<K, SortedSet<V>>) => Record<K, V[]>;
export declare const findDuplicates: <T>(items: T[], field: keyof T) => string[];
