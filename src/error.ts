export const wrapError = (err: unknown, context: string): Error => {
    if (err instanceof Error) {
        return new Error(context, { cause: err });
    } else {
        return new Error(`${context}: ${String(err)}`);
    }
};
