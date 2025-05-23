export const setsEqual = (a, b) => {
    if (a.length !== b.length)
        return false;
    return a.every((val) => b.includes(val)) && b.every((val) => a.includes(val));
};
const _cartesianProduct = (arr, index, sentence, result) => {
    for (let i = 0; i < arr[index].length; i++) {
        const newSentence = sentence.slice(); // To not mutate the original array
        newSentence.push(arr[index][i]);
        if (index < arr.length - 1) {
            _cartesianProduct(arr, index + 1, newSentence, result);
        }
        else {
            result.push(newSentence);
        }
    }
};
export const cartesianProduct = (arr) => {
    const result = [];
    _cartesianProduct(arr, 0, [], result);
    return result;
};
export const isAnyTrue = (arr) => arr.some(Boolean);
export const insertAfterElement = (sourceArray, targetArray, element) => {
    const index = targetArray.findIndex((item) => item === element);
    if (index !== -1) {
        targetArray.splice(index + 1, 0, ...sourceArray);
    }
    else {
        targetArray.push(...sourceArray);
    }
    return targetArray;
};
export const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
};
export const shuffleArray = (array) => {
    const result = [...array];
    for (let i = result.length - 1, j; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};
export const shuffleNumbers = (n) => shuffleArray([...Array(n).keys()]);
export const deduplicateArrayByName = (entries) => deduplicateArray(entries, "name");
export const deduplicateArray = (entries, field) => [
    ...new Map(entries.map((entry) => [entry[field], entry])).values(),
];
export class SortedSet {
    items = new Set();
    comparator;
    constructor(comparator) {
        this.comparator = comparator;
    }
    add(value) {
        this.items.add(value);
    }
    delete(value) {
        return this.items.delete(value);
    }
    has(value) {
        return this.items.has(value);
    }
    toArray() {
        return Array.from(this.items).sort(this.comparator);
    }
}
export class SortedIdSet extends SortedSet {
    ids = new Set();
    id;
    constructor(comparator, id) {
        super(comparator);
        this.id = id;
    }
    add(value) {
        if (!this.ids.has(this.id(value))) {
            super.add(value);
            this.ids.add(this.id(value));
        }
    }
    delete(value) {
        const deleted = super.delete(value);
        if (deleted) {
            this.ids.delete(this.id(value));
        }
        return deleted;
    }
    has(value) {
        return this.ids.has(this.id(value));
    }
}
export const firstByProperty = (items, prop) => {
    const seen = new Set();
    return items.filter((item) => {
        const val = item[prop];
        if (seen.has(val))
            return false;
        seen.add(val);
        return true;
    });
};
//# sourceMappingURL=array.js.map