export type EmptyObjectType = Record<string, never>;
export declare const keysByValue: <K extends string, V>(obj: Record<K, V>, val: V) => K[];
export declare const firstKeyByValue: <K extends string, V>(obj: Record<K, V>, val: V) => K | undefined;
