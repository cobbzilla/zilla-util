var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const DEFAULT_CLOCK = {
    now: () => Date.now(),
};
// adapted from https://stackoverflow.com/a/39914235
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const DEFAULT_NAP_CHECK = 1000;
const _nap = (resolve, clock, alarm, ms, check) => () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const start = clock.now();
        while (!alarm.wake && clock.now() - start < ms) {
            yield sleep(check);
        }
    }
    finally {
        resolve();
    }
});
export const nap = (clock, alarm, ms, check) => new Promise((r) => _nap(r, clock, alarm, ms, check || DEFAULT_NAP_CHECK)());
