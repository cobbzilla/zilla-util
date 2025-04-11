export const keysByValue = (obj, val) => {
    return Object.keys(obj).filter((k) => obj[k] === val);
};
export const firstKeyByValue = (obj, val) => {
    return Object.keys(obj).find((k) => obj[k] === val);
};
//# sourceMappingURL=object.js.map