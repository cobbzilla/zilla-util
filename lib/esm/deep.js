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
                }
                else if (index.startsWith("-")) {
                    operations.push({ remove: parseInt(index.substring(1)) });
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
    // coalesce append operations into their preceding next
    const ops = [];
    let opsIndex = 0;
    for (let i = 0; i < operations.length; i++) {
        if (operations[i].append && opsIndex > 0) {
            ops[opsIndex - 1].append = true;
        }
        else {
            ops[opsIndex] = operations[i];
            opsIndex++;
        }
    }
    return ops;
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
            if (typeof thing === "undefined" || thing == null)
                return undefined;
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
        const next = op.next;
        if (op.append && next) {
            if (typeof thing[next] === "undefined" || thing[next] == null) {
                const nextThing = {};
                thing[next] = [nextThing];
                thing = nextThing;
            }
            else if (Array.isArray(thing[next])) {
                thing[next].push({});
                thing = thing[next][thing[next].length - 1];
            }
            else {
                throw new Error(`deepUpdate: invalid fieldPath (cannot append to non-array): ${fieldPath}`);
            }
        }
        else if (typeof next === "string" || typeof next === "number") {
            if (!(next in thing)) {
                thing[next] = {};
            }
            thing = thing[next];
        }
    }
    const lastOp = operations[operations.length - 1];
    if (lastOp.append) {
        if (typeof lastOp.next === "string" || typeof lastOp.next === "number") {
            if (Array.isArray(thing[lastOp.next])) {
                thing[lastOp.next].push(value);
            }
            else {
                thing[lastOp.next] = [value];
            }
        }
        else if (lastOp.next && Array.isArray(thing[lastOp.next])) {
            thing[lastOp.next].push(value);
        }
        else if (typeof lastOp.next === "undefined" || lastOp.next == null) {
            thing.push(value);
        }
        else {
            throw new Error(`deepUpdate: invalid lastOp (${JSON.stringify(lastOp)}), cannot append`);
        }
    }
    else if (typeof lastOp.remove === "number") {
        thing.splice(lastOp.remove, 1);
    }
    else {
        thing[lastOp.next] = value;
    }
};
export const deepEquals = (object1, object2) => {
    if (object1 === object2)
        return true;
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length === 0 || keys1.length !== keys2.length) {
        return false;
    }
    return keys1.every((key) => {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !deepEquals(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
        return true;
    });
};
export const isObject = (object) => object != null && typeof object === "object";
export const stripNonAlphaNumericKeys = (obj) => {
    for (const key in obj) {
        // Check if key contains any non-alphanumeric characters
        if (/[^a-z0-9_]/i.test(key)) {
            delete obj[key];
        }
        else if (typeof obj[key] === "object" && obj[key] !== null) {
            // If the value is a nested object or array, recurse into it
            stripNonAlphaNumericKeys(obj[key]);
        }
    }
    return obj;
};
export const hasDuplicateProperty = (things, prop) => {
    const found = new Set();
    return things.some((entry) => {
        if (found.has(entry[prop])) {
            return true; // Found a duplicate
        }
        else {
            found.add(entry[prop]);
            return false;
        }
    });
};
export const hasUniqueProperty = (things, prop) => !hasDuplicateProperty(things, prop);
export const filterObject = (obj, keys) => keys.reduce((acc, key) => 
// eslint-disable-next-line no-prototype-builtins
obj.hasOwnProperty(key) ? { ...acc, [key]: obj[key] } : acc, {});
export const isEmpty = (obj) => {
    if (typeof obj === "undefined" || obj == null || obj === "" || (Array.isArray(obj) && obj.length === 0)) {
        return true;
    }
    else if (typeof obj === "object") {
        const fields = Object.keys(obj);
        if (fields.length === 0)
            return true;
        let allEmpty = true;
        for (const fieldName of Object.keys(obj)) {
            if (!isEmpty(obj[fieldName])) {
                allEmpty = false;
                break;
            }
        }
        if (allEmpty)
            return true;
    }
    return false;
};
export const isNotEmpty = (obj) => !isEmpty(obj);
export const filterProperties = (obj, propNames) => {
    return propNames.reduce((acc, prop) => {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            acc[prop] = obj[prop];
        }
        return acc;
    }, {});
};
//# sourceMappingURL=deep.js.map