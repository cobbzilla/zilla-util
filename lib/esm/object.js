export const keysByValue = (obj, val) => {
    return Object.keys(obj).filter((k) => obj[k] === val);
};
export const firstKeyByValue = (obj, val) => {
    return Object.keys(obj).find((k) => obj[k] === val);
};
export const enumRecord = (e, init) => {
    const o = {};
    for (const k of Object.values(e)) {
        o[k] = typeof init === "function" ? init() : init;
    }
    return o;
};
//# sourceMappingURL=object.js.map