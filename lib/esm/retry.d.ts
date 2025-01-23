export type RetryOptions = {
    maxAttempts?: number;
    backoffBaseMillis?: number;
    backoffMultiplier?: number;
    canRetry?: (e: Error) => Promise<boolean> | boolean;
};
export declare const DEFAULT_RETRY_MAX_ATTEMPTS = 3;
export declare const DEFAULT_RETRY_BACKOFF_BASE_MILLIS = 250;
export declare const DEFAULT_RETRY_BACKOFF_MULTIPLIER = 3;
export declare const DEFAULT_RETRY_CAN_RETRY_FUNC: () => boolean;
export declare const DEFAULT_RETRY_OPTS: RetryOptions;
export declare const retry: <T>(fn: () => Promise<T>, opts?: RetryOptions) => Promise<T>;
