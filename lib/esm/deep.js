export const parseDeep = (fieldPath) => {
    const parts = fieldPath.split(".");
    const operations = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let squareBracketStart = part.indexOf("[");
        if (squareBracketStart !== -1) {
            const field = part.substring(0, squareBracketStart);
            operations.push({ next: field });
            while (squareBracketStart !== -1) {
                const squareBracketEnd = part.indexOf("]", squareBracketStart);
                if (squareBracketEnd === -1) {
                    throw new Error(`parseDeep: invalid fieldPath (missing closing square bracket): ${fieldPath}`);
                }
                const index = part.substring(squareBracketStart + 1, squareBracketEnd);
                if (index.length === 0) {
                    operations.push({ append: true });
                    break;
                }
                else if (index.startsWith("-")) {
                    operations.push({ remove: parseInt(index.substring(1)) });
                    break;
                }
                else {
                    operations.push({ next: parseInt(index) });
                }
                squareBracketStart = part.indexOf("[", squareBracketEnd);
            }
        }
        else {
            operations.push({ next: part });
        }
    }
    return operations;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepGet = (obj, fieldPath) => {
    const operations = parseDeep(fieldPath);
    let thing = obj;
    for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        if (op.append) {
            throw new Error(`deepGet: invalid fieldPath (cannot append): ${fieldPath}`);
        }
        if (op.remove) {
            throw new Error(`deepGet: invalid fieldPath (cannot remove): ${fieldPath}`);
        }
        const next = op.next;
        if (typeof next === "string" || typeof next === "number") {
            thing = thing[next];
        }
    }
    return thing;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepUpdate = (obj, fieldPath, value) => {
    const operations = parseDeep(fieldPath);
    let thing = obj;
    for (let i = 0; i < operations.length - 1; i++) {
        const op = operations[i];
        if (op.append) {
            throw new Error(`deepUpdate: invalid fieldPath (cannot update after append []): ${fieldPath}`);
        }
        const next = op.next;
        if (typeof next === "string" || typeof next === "number") {
            thing = thing[next];
        }
    }
    const lastOp = operations[operations.length - 1];
    if (lastOp.append) {
        thing.push(value);
    }
    else if (typeof lastOp.remove === "number") {
        thing.splice(lastOp.remove, 1);
    }
    else {
        thing[lastOp.next] = value;
    }
};
//# sourceMappingURL=deep.js.map