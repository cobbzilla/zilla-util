export declare const setsEqual: <T>(a: T[], b: T[]) => boolean;
export declare const cartesianProduct: <T>(arr: T[][]) => T[][];
export declare const isAnyTrue: <T extends boolean[]>(arr: T) => boolean;
export declare const insertAfterElement: <T>(sourceArray: T[], targetArray: T[], element: T) => T[];
export declare const asyncFilter: <T>(arr: T[], predicate: (item: T) => Promise<boolean>) => Promise<T[]>;
export declare const shuffleNumbers: (n: number) => number[];
