export const setsEqual = <T>(a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val) => b.includes(val)) && b.every((val) => a.includes(val));
};

const _cartesianProduct = <T>(arr: T[][], index: number, sentence: T[], result: T[][]) => {
    for (let i = 0; i < arr[index].length; i++) {
        const newSentence = sentence.slice(); // To not mutate the original array
        newSentence.push(arr[index][i]);
        if (index < arr.length - 1) {
            _cartesianProduct(arr, index + 1, newSentence, result);
        } else {
            result.push(newSentence);
        }
    }
};

export const cartesianProduct = <T>(arr: T[][]): T[][] => {
    const result: T[][] = [];
    _cartesianProduct(arr, 0, [], result);
    return result;
};

export const isAnyTrue = <T extends boolean[]>(arr: T): boolean => arr.some(Boolean);

export const insertAfterElement = <T>(sourceArray: T[], targetArray: T[], element: T): T[] => {
    const index: number = targetArray.findIndex((item) => item === element);

    if (index !== -1) {
        targetArray.splice(index + 1, 0, ...sourceArray);
    } else {
        targetArray.push(...sourceArray);
    }

    return targetArray;
};

export const asyncFilter = async <T>(arr: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
};

export const shuffleArray = <T>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1, j: number; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

export const shuffleNumbers = (n: number): number[] => shuffleArray([...Array(n).keys()]);

export const deduplicateArrayByName = (entries: Record<string, unknown>[]): Record<string, unknown>[] =>
    deduplicateArray(entries, "name");

export const deduplicateArray = (entries: Record<string, unknown>[], field: string): Record<string, unknown>[] => [
    ...new Map(entries.map((entry) => [entry[field], entry])).values(),
];

export class SortedSet<T> {
    private items = new Set<T>();
    private comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    add(value: T): void {
        this.items.add(value);
    }

    delete(value: T): boolean {
        return this.items.delete(value);
    }

    has(value: T): boolean {
        return this.items.has(value);
    }

    toArray(): T[] {
        return Array.from(this.items).sort(this.comparator);
    }
}

export class SortedIdSet<T, ID> extends SortedSet<T> {
    private ids = new Set<ID>();
    private id: (a: T) => ID;

    constructor(comparator: (a: T, b: T) => number, id: (a: T) => ID) {
        super(comparator);
        this.id = id;
    }

    add(value: T): void {
        if (!this.ids.has(this.id(value))) {
            super.add(value);
            this.ids.add(this.id(value));
        }
    }

    delete(value: T): boolean {
        const deleted = super.delete(value);
        if (deleted) {
            this.ids.delete(this.id(value));
        }
        return deleted;
    }

    has(value: T): boolean {
        return this.ids.has(this.id(value));
    }
}

export const firstByProperty = <T extends Record<string, unknown>>(items: T[], prop: keyof T): T[] => {
    const seen: Set<unknown> = new Set();
    return items.filter((item) => {
        const val = item[prop];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
};
