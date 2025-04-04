import { GenericLogger } from "./logger.js";
export type ZillaNowFunc = () => number;
export type ZillaClock = {
    now: ZillaNowFunc;
};
export declare const DEFAULT_CLOCK: ZillaClock;
export type ZillaClockSource = () => ZillaClock;
export declare const DEFAULT_CLOCK_SOURCE: ZillaClockSource;
export declare class MockClock {
    private time;
    private logger?;
    private name;
    constructor(startTime?: number, logger?: GenericLogger, name?: string);
    now(): number;
    advance(timeDelta: number): void;
}
export declare const mockClock: (startTime?: number) => ZillaClock;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const DEFAULT_NAP_CHECK = 1000;
export type NapAlarm = {
    wake?: boolean;
};
export declare const nap: (clock: ZillaClock, alarm: NapAlarm, ms: number, check?: number) => Promise<unknown>;
