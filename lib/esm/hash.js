import Sha256 from "./sha256.js";
export const sha256 = (s) => Sha256.hash(`${s}`);
export const insertAtIndex = (str, insert, index) => {
    return str.slice(0, index) + insert + str.slice(index);
};
export const shaLevels = (val, levels) => {
    return dirLevels(sha256(`${val}`), levels);
};
export const dirLevels = (val, levels) => {
    let s = `${val}`;
    if (levels > 0) {
        for (let i = 0; i < levels; i++) {
            s = insertAtIndex(s, "/", 2 + 3 * i);
        }
    }
    return s;
};
//# sourceMappingURL=hash.js.map