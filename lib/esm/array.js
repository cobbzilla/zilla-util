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
//# sourceMappingURL=array.js.map