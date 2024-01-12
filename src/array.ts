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
