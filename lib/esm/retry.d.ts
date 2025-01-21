export type RetryOptions = {
    maxAttempts?: number;
    backoffBaseMillis?: number;
    backoffMultiplier?: number;
    canRetry?: (e: Error) => boolean;
};
export declare const retry: <T>(fn: () => Promise<T>, opts?: RetryOptions) => Promise<T>;
