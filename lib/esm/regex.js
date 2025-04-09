export const shortStringMatch = (regex) => {
    if (regex.test(""))
        return "";
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let length = 1; length <= 3; length++) {
        const stack = [{ text: "", index: 0 }];
        while (stack.length) {
            const { text, index } = stack.pop();
            if (index === length) {
                if (regex.test(text))
                    return text;
            }
            else {
                for (const c of chars) {
                    stack.push({ text: text + c, index: index + 1 });
                }
            }
        }
    }
    throw new Error("No short match found up to length 3");
};
//# sourceMappingURL=regex.js.map