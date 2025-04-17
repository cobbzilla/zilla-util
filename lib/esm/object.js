export const keysByValue = (obj, val) => {
    return Object.keys(obj).filter((k) => obj[k] === val);
};
export const firstKeyByValue = (obj, val) => {
    return Object.keys(obj).find((k) => obj[k] === val);
};
export const enumRecord = (e, init) => {
    const o = {};
    for (const k of Object.values(e)) {
        o[k] = typeof init === "function" ? init(k) : init;
    }
    return o;
};
export const setsToArrays = (input) => Object.fromEntries(Object.entries(input).map(([k, set]) => [k, set.toArray()]));
export const findDuplicates = (items, field) => {
    const counts = new Map();
    for (const item of items) {
        const key = String(item[field]);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts].filter(([, n]) => n > 1).map(([k]) => k);
};
//# sourceMappingURL=object.js.map