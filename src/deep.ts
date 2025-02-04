export type ObjectNav = {
    append?: boolean;
    remove?: number;
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
                } else if (index.startsWith("-")) {
                    operations.push({ remove: parseInt(index.substring(1)) });
                } else {
                    operations.push({ next: parseInt(index) });
                }
                squareBracketStart = part.indexOf("[", squareBracketEnd);
            }
        } else {
            operations.push({ next: part });
        }
    }
    // coalesce append operations into their preceding next
    const ops = [];
    let opsIndex = 0;
    for (let i = 0; i < operations.length; i++) {
        if (operations[i].append && opsIndex > 0) {
            ops[opsIndex - 1].append = true;
        } else {
            ops[opsIndex] = operations[i];
            opsIndex++;
        }
    }
    return ops;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepGet = <T>(obj: any, fieldPath: string): T | undefined => {
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
            if (typeof thing === "undefined" || thing == null) return undefined;
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
        const next = op.next;
        if (op.append && next) {
            if (typeof thing[next] === "undefined" || thing[next] == null) {
                const nextThing = {};
                thing[next] = [nextThing];
                thing = nextThing;
            } else if (Array.isArray(thing[next])) {
                thing[next].push({});
                thing = thing[next][thing[next].length - 1];
            } else {
                throw new Error(`deepUpdate: invalid fieldPath (cannot append to non-array): ${fieldPath}`);
            }
        } else if (typeof next === "string" || typeof next === "number") {
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
            } else {
                thing[lastOp.next] = [value];
            }
        } else if (lastOp.next && Array.isArray(thing[lastOp.next])) {
            thing[lastOp.next].push(value);
        } else if (typeof lastOp.next === "undefined" || lastOp.next == null) {
            thing.push(value);
        } else {
            throw new Error(`deepUpdate: invalid lastOp (${JSON.stringify(lastOp)}), cannot append`);
        }
    } else if (typeof lastOp.remove === "number") {
        thing.splice(lastOp.remove, 1);
    } else {
        thing[lastOp.next as string | number] = value;
    }
};

export const deepEquals = <T>(object1: T, object2: T): boolean => {
    if (object1 === object2) return true;

    const keys1 = Object.keys(object1 as Record<keyof T, unknown>) as (keyof T)[];
    const keys2 = Object.keys(object2 as Record<keyof T, unknown>) as (keyof T)[];

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

export const deepAtLeastEquals = <T>(subset: Partial<T>, superset: Partial<T>, ignore?: (keyof T)[]): boolean => {
    if (subset === superset) return true;

    const keysSubset = Object.keys(subset as Record<keyof T, unknown>) as (keyof T)[];

    return keysSubset
        .filter((k) => !ignore || !ignore.includes(k))
        .every((key) => {
            if (!(key in superset)) {
                return false;
            }

            const val1 = subset[key];
            const val2 = superset[key];

            if (val2 === undefined) {
                // Ensure superset contains the property
                return false;
            }

            const areObjects = isObject(val1) && isObject(val2);

            if (areObjects) {
                return deepAtLeastEquals(val1 as Record<string, unknown>, val2 as Partial<Record<string, unknown>>);
            }

            return val1 === val2;
        });
};

export const isObject = <T>(object: T): boolean => object != null && typeof object === "object";

export const stripNonAlphaNumericKeys = <T>(obj: T): T => {
    for (const key in obj) {
        // Check if key contains any non-alphanumeric characters
        if (/[^a-z0-9_]/i.test(key)) {
            delete obj[key];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            // If the value is a nested object or array, recurse into it
            stripNonAlphaNumericKeys(obj[key]);
        }
    }
    return obj;
};

export const hasDuplicateProperty = (things: Record<string, unknown>[], prop: string): boolean => {
    const found = new Set();
    return things.some((entry) => {
        if (found.has(entry[prop])) {
            return true; // Found a duplicate
        } else {
            found.add(entry[prop]);
            return false;
        }
    });
};

export const hasUniqueProperty = (things: Record<string, unknown>[], prop: string): boolean =>
    !hasDuplicateProperty(things, prop);

export const filterObject = <T>(obj: Record<string, T>, keys: string[]): Record<string, T> =>
    keys.reduce(
        (acc: Record<string, T>, key: string) =>
            // eslint-disable-next-line no-prototype-builtins
            obj.hasOwnProperty(key) ? { ...acc, [key]: obj[key] } : acc,
        {}
    );

export const isEmpty = (obj?: unknown | null | undefined): boolean => {
    if (typeof obj === "undefined" || obj == null || obj === "" || (Array.isArray(obj) && obj.length === 0)) {
        return true;
    } else if (typeof obj === "object") {
        const fields = Object.keys(obj);
        if (fields.length === 0) return true;
        let allEmpty = true;
        for (const fieldName of Object.keys(obj)) {
            if (!isEmpty((obj as Record<string, unknown>)[fieldName])) {
                allEmpty = false;
                break;
            }
        }
        if (allEmpty) return true;
    }
    return false;
};

export const isNotEmpty = (obj?: unknown | null | undefined): boolean => !isEmpty(obj);

export const filterProperties = (obj: Record<string, unknown>, propNames: string[]): Record<string, unknown> => {
    return propNames.reduce((acc, prop) => {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            acc[prop] = obj[prop];
        }
        return acc;
    }, {} as Record<string, unknown>);
};

export const deepEqualsForFields = (
    o1: Record<string, unknown>,
    o2: Record<string, unknown>,
    propNames: string[]
): boolean => {
    const t1 = filterProperties(o1, propNames);
    const t2 = filterProperties(o2, propNames);
    return deepEquals(t1, t2);
};

export const FN_ALWAYS_TRUE = () => true;
export const FN_ALWAYS_FALSE = () => false;

const proxyCache = new WeakMap<object, unknown>();
const arrayMutators = new Set([
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse",
    "fill",
    "copyWithin",
    "append",
]);

export const immutify = <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (proxyCache.has(obj)) return proxyCache.get(obj) as T;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler: ProxyHandler<any> = Array.isArray(obj)
        ? {
              get(target, prop, receiver) {
                  if (typeof prop === "string" && arrayMutators.has(prop)) return () => undefined;
                  const value = Reflect.get(target, prop, receiver);
                  return value && typeof value === "object" ? immutify(value) : value;
              },
              set: FN_ALWAYS_TRUE,
              deleteProperty: FN_ALWAYS_TRUE,
              defineProperty: FN_ALWAYS_TRUE,
              setPrototypeOf: FN_ALWAYS_TRUE,
          }
        : {
              get(target, prop, receiver) {
                  const value = Reflect.get(target, prop, receiver);
                  return value && typeof value === "object" ? immutify(value) : value;
              },
              set: FN_ALWAYS_TRUE,
              deleteProperty: FN_ALWAYS_TRUE,
              defineProperty: FN_ALWAYS_TRUE,
              setPrototypeOf: FN_ALWAYS_TRUE,
          };

    const proxy = new Proxy(obj, handler);
    proxyCache.set(obj, proxy);
    return proxy;
};
