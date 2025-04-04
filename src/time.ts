import { uuidv4 } from "./string.js";
import { GenericLogger } from "./logger.js";

export type ZillaNowFunc = () => number;

const DEFAULT_NOW_FUNC: ZillaNowFunc = () => Date.now();

export type ZillaClock = {
    now: ZillaNowFunc;
};

export const DEFAULT_CLOCK: ZillaClock = {
    now: DEFAULT_NOW_FUNC,
};

export type ZillaClockSource = () => ZillaClock;

export const DEFAULT_CLOCK_SOURCE: ZillaClockSource = () => DEFAULT_CLOCK;

export class MockClock {
    private time: number;
    private logger?: GenericLogger;
    private name: string;
    constructor(startTime?: number, logger?: GenericLogger, name?: string) {
        this.time = typeof startTime === "number" ? startTime : Date.now();
        this.logger = logger;
        this.name = name ? name : `MockClock-${uuidv4()}`;
    }
    now(): number {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`MockClock ID=${this.name} RETURNING now=${this.time}`);
        }
        return this.time;
    }
    advance(timeDelta: number): void {
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`MockClock ID=${this.name} ADVANCING now=${this.time} timeDelta=${timeDelta}`);
        }
        this.time += timeDelta;
        if (this.logger && this.logger.isTraceEnabled()) {
            this.logger.trace(`MockClock ID=${this.name} ADVANCED now=${this.time}`);
        }
    }
}
export const mockClock = (startTime: number = 0): ZillaClock => new MockClock(startTime);

// adapted from https://stackoverflow.com/a/39914235
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const DEFAULT_NAP_CHECK = 1000;

const _nap =
    (resolve: (v?: unknown) => void, clock: ZillaClock, alarm: NapAlarm, ms: number, check: number) => async () => {
        try {
            alarm.wake = false;
            const start = clock.now();
            while (!alarm.wake && clock.now() - start < ms) {
                await sleep(check);
            }
        } finally {
            resolve();
        }
    };

export type NapAlarm = {
    wake?: boolean;
};

export const nap = (clock: ZillaClock, alarm: NapAlarm, ms: number, check?: number) =>
    new Promise((r) => _nap(r, clock, alarm, ms, check || DEFAULT_NAP_CHECK)());
