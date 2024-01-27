import Sha256 from "./sha256.js";
export const sha256 = (s: unknown) => Sha256.hash(`${s}`);

export const insertAtIndex = (str: string, insert: string, index: number): string => {
    return str.slice(0, index) + insert + str.slice(index);
};

export const shaLevels = (val: string | number | boolean, levels: number): string => {
    let s = sha256(`${val}`);
    if (levels > 0) {
        for (let i = 0; i < levels; i++) {
            s = insertAtIndex(s, "/", 2 + 3 * i);
        }
    }
    return s;
};
