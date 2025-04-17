export type EmptyObjectType = Record<string, never>;

export const keysByValue = <K extends string, V>(obj: Record<K, V>, val: V): K[] => {
    return (Object.keys(obj) as K[]).filter((k) => obj[k] === val);
};

export const firstKeyByValue = <K extends string, V>(obj: Record<K, V>, val: V): K | undefined => {
    return (Object.keys(obj) as K[]).find((k) => obj[k] === val);
};

export const enumRecord = <E extends string | number | symbol, V>(
    e: Record<string, E>,
    init: V | (() => V)
): Record<E, V> => {
    const o = {} as Record<E, V>;
    for (const k of Object.values(e) as E[]) {
        o[k] = typeof init === "function" ? (init as () => V)() : init;
    }
    return o;
};
