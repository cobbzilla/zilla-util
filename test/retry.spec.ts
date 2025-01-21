import { describe, it } from "mocha";
import { expect } from "chai";
import { retry, RetryOptions } from "../lib/esm/index.js";

type Counter = { count: number };

const succeedAfter = (counter: Counter, failUtil: number): (() => Promise<number>) => {
    return () => {
        if (counter.count < failUtil) {
            counter.count++;
            throw new Error(`failed on ${failUtil}`);
        }
        return Promise.resolve(counter.count);
    };
};

describe("test retries", async () => {
    it("does not retry when maxAttempts=1", async () => {
        const maxAttempts = 1;
        const opts: RetryOptions = {
            maxAttempts,
            backoffBaseMillis: 10,
            backoffMultiplier: 1.1,
            canRetry: () => true,
        };
        const counter: Counter = { count: 0 };
        const failOn = maxAttempts + 1;
        const func = succeedAfter(counter, failOn);
        try {
            await retry<number>(func, opts);
        } catch (e) {
            expect(counter.count).eq(1, `expected only 1 try`);
        }
    });

    it("does retry when maxAttempts=2", async () => {
        const maxAttempts = 2;
        const opts: RetryOptions = {
            maxAttempts,
            backoffBaseMillis: 10,
            backoffMultiplier: 1.1,
            canRetry: () => true,
        };
        const counter: Counter = { count: 0 };
        const failOn = maxAttempts + 1;
        const func = succeedAfter(counter, failOn);
        try {
            await retry<number>(func, opts);
        } catch (e) {
            expect(counter.count).eq(2, `expected 1 try and 1 retry`);
        }
    });

    it("does retry and eventually succeed", async () => {
        const maxAttempts = 10;
        const opts: RetryOptions = {
            maxAttempts,
            backoffBaseMillis: 10,
            backoffMultiplier: 1.1,
            canRetry: () => true,
        };
        const counter: Counter = { count: 0 };
        const failOn = maxAttempts - 1;
        const func = succeedAfter(counter, failOn);
        await retry<number>(func, opts);
        expect(counter.count).eq(failOn, `expected 1 try and ${failOn - 1} retries`);
    });
});
