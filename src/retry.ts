import { sleep } from "./time.js";

export type RetryOptions = {
    maxAttempts?: number;
    backoffBaseMillis?: number;
    backoffMultiplier?: number;
    canRetry?: (e: Error) => boolean;
};

export const DEFAULT_RETRY_MAX_ATTEMPTS = 3;
export const DEFAULT_RETRY_BACKOFF_BASE_MILLIS = 250;
export const DEFAULT_RETRY_BACKOFF_MULTIPLIER = 3;
export const DEFAULT_RETRY_CAN_RETRY_FUNC = () => true;

export const DEFAULT_RETRY_OPTS: RetryOptions = {
    maxAttempts: DEFAULT_RETRY_MAX_ATTEMPTS,
    backoffBaseMillis: DEFAULT_RETRY_BACKOFF_BASE_MILLIS,
    backoffMultiplier: DEFAULT_RETRY_BACKOFF_MULTIPLIER,
    canRetry: DEFAULT_RETRY_CAN_RETRY_FUNC,
};

export const retry = async <T>(fn: () => Promise<T>, opts?: RetryOptions): Promise<T> => {
    const maxAttempts = opts?.maxAttempts || DEFAULT_RETRY_MAX_ATTEMPTS;
    const backoffBaseMillis = opts?.backoffBaseMillis || DEFAULT_RETRY_BACKOFF_BASE_MILLIS;
    const backoffMultiplier = opts?.backoffMultiplier || DEFAULT_RETRY_BACKOFF_MULTIPLIER;
    const canRetry = opts?.canRetry || DEFAULT_RETRY_CAN_RETRY_FUNC;
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
            if (!canRetry(e as Error)) {
                throw e;
            }
        }
    }
    throw error;
};
