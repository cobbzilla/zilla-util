export type StringXformFunction = (args?: string[]) => string;
export type StringXformContext = Record<string, string | StringXformFunction>;
export declare const ERR_UNKNOWN_SUBST_CONTEXT_VAR = "Unknown context variable";
export declare const substContext: (obj: unknown, context: StringXformContext, opts: {
    strict: boolean;
}) => unknown;
