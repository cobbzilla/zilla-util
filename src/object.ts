export type EmptyObjectType = Record<string, never>;

export const keysByValue = <K extends string, V>(obj: Record<K, V>, val: V): K[] => {
    return (Object.keys(obj) as K[]).filter((k) => obj[k] === val);
};

export const firstKeyByValue = <K extends string, V>(obj: Record<K, V>, val: V): K | undefined => {
    return (Object.keys(obj) as K[]).find((k) => obj[k] === val);
};
