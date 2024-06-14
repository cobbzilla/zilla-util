export type StringXformFunction = (args?: string[]) => string;

export type StringXformContext = Record<string, string | StringXformFunction | undefined | null>;

export const ERR_UNKNOWN_SUBST_CONTEXT_VAR = "Unknown context variable";

export const substContext = (obj: unknown, context: StringXformContext, opts?: { strict: boolean }): unknown => {
    const transformString = (str: string): string => {
        return str.replace(/{{(.*?)}}/g, (_, key) => {
            const parts: string[] = key
                .trim()
                .split(/\s+/)
                .filter((s: string) => s.length > 0)
                .map((s: string) => s.trim());
            const k = parts[0];
            const args = parts.length > 1 ? parts.slice(1) : [];

            const subst = context[k];

            if (typeof subst === "string") return subst;
            if (typeof subst === "function") {
                return subst(args);
            }
            if (!opts || opts?.strict !== false) throw new Error(`${ERR_UNKNOWN_SUBST_CONTEXT_VAR} var=${k}`);
            return `??${k}`;
        });
    };

    const transform = (item: unknown): unknown => {
        if (typeof item === "string") {
            return transformString(item);
        } else if (Array.isArray(item)) {
            return item.map(transform);
        } else if (item && typeof item === "object") {
            return Object.fromEntries(Object.entries(item).map(([k, v]) => [k, transform(v)]));
        }
        return item;
    };

    return transform(obj);
};
