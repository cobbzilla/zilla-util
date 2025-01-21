import { sleep } from "./time";

export type RetryOptions = {
    maxAttempts?: number;
    backoffBaseMillis?: number;
    backoffMultiplier?: number;
    canRetry?: (e: Error) => boolean;
};
export const retry = async <T>(fn: () => Promise<T>, opts?: RetryOptions): Promise<T> => {
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
        } catch (e) {
            error = e;
            if (typeof opts?.canRetry === "function" && !opts.canRetry(e as Error)) {
                throw e;
            }
        }
    }
    throw error;
};
