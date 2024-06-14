export type ZillaNowFunc = () => number;
export type ZillaClock = {
    now: ZillaNowFunc;
};
export declare const DEFAULT_CLOCK: ZillaClock;
export type ZillaClockSource = () => ZillaClock;
export declare const time: (ms: number) => Promise<unknown>;
export declare const DEFAULT_NAP_CHECK = 1000;
export type NapAlarm = {
    wake?: boolean;
};
export declare const nap: (clock: ZillaClock, alarm: NapAlarm, ms: number, check?: number) => Promise<unknown>;
