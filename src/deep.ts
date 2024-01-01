export type ObjectNav = {
    append?: boolean;
    next?: string | number;
};

export const parseDeep = (fieldPath: string): ObjectNav[] => {
    const parts = fieldPath.split(".");
    const operations: ObjectNav[] = [];
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
                } else {
                    operations.push({ next: parseInt(index) });
                }
                squareBracketStart = part.indexOf("[", squareBracketEnd);
            }
        } else {
            operations.push({ next: part });
        }
    }
    return operations;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepGet = (obj: any, fieldPath: string): unknown => {
    const operations = parseDeep(fieldPath);

    let thing = obj;
    for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        if (op.append) {
            throw new Error(`deepGet: invalid fieldPath (cannot update after append []): ${fieldPath}`);
        }
        const next = op.next;
        if (typeof next === "string" || typeof next === "number") {
            thing = thing[next];
        }
    }
    return thing;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepUpdate = (obj: any, fieldPath: string, value: any) => {
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
    } else {
        thing[lastOp.next!] = value;
    }
};
