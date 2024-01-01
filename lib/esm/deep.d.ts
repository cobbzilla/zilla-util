export type ObjectNav = {
    append?: boolean;
    next?: string | number;
};
export declare const parseDeep: (fieldPath: string) => ObjectNav[];
export declare const deepGet: (obj: any, fieldPath: string) => unknown;
export declare const deepUpdate: (obj: any, fieldPath: string, value: any) => void;
