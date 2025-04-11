export const wrapError = (context, err) => {
    if (err instanceof Error) {
        return new Error(context, { cause: err });
    }
    else {
        return new Error(`${context}: ${String(err)}`);
    }
};
//# sourceMappingURL=error.js.map