export type YuebingClock = {
    now: () => number;
};
export declare const DEFAULT_CLOCK: YuebingClock;
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const DEFAULT_NAP_CHECK = 1000;
export type NapAlarm = {
    wake?: boolean;
};
export declare const nap: (clock: YuebingClock, alarm: NapAlarm, ms: number, check?: number) => Promise<unknown>;
