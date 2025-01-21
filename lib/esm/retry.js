import { sleep } from "./time";
export const retry = async (fn, opts) => {
    const maxAttempts = opts?.maxAttempts || 3;
    const backoffBaseMillis = opts?.backoffBaseMillis || 250;
    const backoffMultiplier = opts?.backoffMultiplier || 3;
    let backoffTime = backoffBaseMillis;
    let error;
    for (let i = 0; i < maxAttempts; i++) {
        if (i > 0) {
            await sleep(backoffTime);
            backoffTime = Math.floor(backoffTime * backoffMultiplier);
        }
        try {
            return await fn();
        }
        catch (e) {
            error = e;
            if (typeof opts?.canRetry === "function" && !opts.canRetry(e)) {
                throw e;
            }
        }
    }
    throw error;
};
//# sourceMappingURL=retry.js.map