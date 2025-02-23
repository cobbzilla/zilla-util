import { sleep } from "./time.js";
export const DEFAULT_RETRY_MAX_ATTEMPTS = 3;
export const DEFAULT_RETRY_BACKOFF_BASE_MILLIS = 250;
export const DEFAULT_RETRY_BACKOFF_MULTIPLIER = 3;
export const DEFAULT_RETRY_CAN_RETRY_FUNC = () => true;
export const DEFAULT_RETRY_OPTS = {
    maxAttempts: DEFAULT_RETRY_MAX_ATTEMPTS,
    backoffBaseMillis: DEFAULT_RETRY_BACKOFF_BASE_MILLIS,
    backoffMultiplier: DEFAULT_RETRY_BACKOFF_MULTIPLIER,
    canRetry: DEFAULT_RETRY_CAN_RETRY_FUNC,
};
export const retry = async (fn, opts, logger, action) => {
    const maxAttempts = opts?.maxAttempts || DEFAULT_RETRY_MAX_ATTEMPTS;
    const backoffBaseMillis = opts?.backoffBaseMillis || DEFAULT_RETRY_BACKOFF_BASE_MILLIS;
    const backoffMultiplier = opts?.backoffMultiplier || DEFAULT_RETRY_BACKOFF_MULTIPLIER;
    const canRetry = opts?.canRetry || DEFAULT_RETRY_CAN_RETRY_FUNC;
    const prefix = logger ? (action ? `@@@ retry[${action}]:` : "retry:") : "";
    let backoffTime = backoffBaseMillis;
    let error;
    if (logger && logger.isDebugEnabled()) {
        logger.debug(`${prefix} starting with opts=${opts ? JSON.stringify(opts) : "undefined"}`);
    }
    for (let i = 0; i < maxAttempts; i++) {
        const iPrefix = `${prefix} [${i + 1}/${maxAttempts}]:`;
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
        }
        catch (e) {
            error = e;
            if (!(await canRetry(e))) {
                if (logger && logger.isDebugEnabled()) {
                    logger.debug(`${iPrefix} function threw error and canRetry=false, throwing e=${e}`, e);
                }
                throw e;
            }
            if (logger && logger.isDebugEnabled()) {
                logger.debug(`${iPrefix} function threw error=${e} and canRetry=true, continuing`, e);
            }
        }
    }
    if (logger && logger.isDebugEnabled()) {
        logger.debug(`${prefix} maxAttempts exceeded, throwing most recent error=${error}`, error);
    }
    throw error;
};
//# sourceMappingURL=retry.js.map