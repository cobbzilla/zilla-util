export type ObjectNav = {
    append?: boolean;
    remove?: number;
    next?: string | number;
};
export declare const parseDeep: (fieldPath: string) => ObjectNav[];
export declare const deepGet: (obj: any, fieldPath: string) => unknown;
export declare const deepUpdate: (obj: any, fieldPath: string, value: any) => void;
export declare const deepEquals: <T>(object1: T, object2: T) => boolean;
export declare const deepAtLeastEquals: <T>(subset: Partial<T>, superset: Partial<T>, ignore?: (keyof T)[] | undefined) => boolean;
export declare const isObject: <T>(object: T) => boolean;
export declare const stripNonAlphaNumericKeys: <T>(obj: T) => T;
export declare const hasDuplicateProperty: (things: Record<string, unknown>[], prop: string) => boolean;
export declare const hasUniqueProperty: (things: Record<string, unknown>[], prop: string) => boolean;
export declare const filterObject: <T>(obj: Record<string, T>, keys: string[]) => Record<string, T>;
export declare const isEmpty: (obj?: unknown | null | undefined) => boolean;
export declare const isNotEmpty: (obj?: unknown | null | undefined) => boolean;
export declare const filterProperties: (obj: Record<string, any>, propNames: string[]) => Record<string, any>;
export declare const deepEqualsForFields: (o1: Record<string, any>, o2: Record<string, any>, propNames: string[]) => boolean;
