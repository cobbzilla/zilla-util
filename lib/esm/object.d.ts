export type EmptyObjectType = Record<string, never>;
export declare const keysByValue: <K extends string, V>(obj: Record<K, V>, val: V) => K[];
export declare const firstKeyByValue: <K extends string, V>(obj: Record<K, V>, val: V) => K | undefined;
export declare const enumRecord: <E extends string | number | symbol, V>(e: Record<string, E>, init: V | (() => V)) => Record<E, V>;
