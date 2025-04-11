export const wrapError = (context: string, err: unknown): Error => {
    if (err instanceof Error) {
        return new Error(context, { cause: err });
    } else {
        return new Error(`${context}: ${String(err)}`);
    }
};
