import { sleep } from "./time.js";
import { GenericLogger } from "./logger.js";

export type RetryOptions = {
    maxAttempts?: number;
    backoffBaseMillis?: number;
    backoffMultiplier?: number;
    canRetry?: (e: Error) => Promise<boolean> | boolean;
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

export const retry = async <T>(
    fn: () => Promise<T>,
    opts?: RetryOptions,
    logger?: GenericLogger,
    action?: string
): Promise<T> => {
    const maxAttempts = opts?.maxAttempts || DEFAULT_RETRY_MAX_ATTEMPTS;
    const backoffBaseMillis = opts?.backoffBaseMillis || DEFAULT_RETRY_BACKOFF_BASE_MILLIS;
    const backoffMultiplier = opts?.backoffMultiplier || DEFAULT_RETRY_BACKOFF_MULTIPLIER;
    const canRetry = opts?.canRetry || DEFAULT_RETRY_CAN_RETRY_FUNC;
    const prefix = logger ? (action ? `retry[${action}]:` : "retry:") : "";
    let backoffTime = backoffBaseMillis;
    let error;
    for (let i = 0; i < maxAttempts; i++) {
        const iPrefix = `${prefix} [${i}/${maxAttempts}]:`;
        if (i > 0) {
            if (logger && logger.isDebugEnabled()) {
                logger.debug(`${iPrefix} waiting for ${backoffTime} before retrying`);
            }
            await sleep(backoffTime);
            backoffTime = Math.floor(backoffTime * backoffMultiplier);
        }
        try {
            if (logger && logger.isDebugEnabled()) {
                logger.debug(`${iPrefix} calling function`);
            }
            return await fn();
        } catch (e) {
            error = e;
            if (!(await canRetry(e as Error))) {
                if (logger && logger.isDebugEnabled()) {
                    logger.debug(`${iPrefix} function threw error and canRetry=false, throwing e=${e}`, e as Error);
                }
                throw e;
            }
            if (logger && logger.isDebugEnabled()) {
                logger.debug(`${iPrefix} function threw error and canRetry=true, continuing`);
            }
        }
    }
    if (logger && logger.isDebugEnabled()) {
        logger.debug(`${prefix} maxAttempts exceeded, throwing most recent error=${error}`, error as Error);
    }
    throw error;
};
