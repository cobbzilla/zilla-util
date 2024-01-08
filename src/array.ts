export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val) => b.includes(val)) && b.every((val) => a.includes(val));
};
