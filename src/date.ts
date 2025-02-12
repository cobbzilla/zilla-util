import { ZillaClock } from "./time.js";

export const formatDate = (template: string, clock?: ZillaClock): string => {
    const d = clock ? new Date(clock.now()) : new Date();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const hour = d.getUTCHours();
    const minute = d.getUTCMinutes();
    const second = d.getUTCSeconds();

    return (template.match(/(YYYY|YY|MM|DD|HH|mm|ss|M|D|H|m|s|'[^']*'|[^YMDHms']+)/g) || [])
        .map((token) => {
            if (token.startsWith("'")) return token.slice(1, -1);
            switch (token) {
                case "YYYY":
                    return String(year);
                case "YY":
                    return String(year).slice(-2);
                case "MM":
                    return String(month).padStart(2, "0");
                case "M":
                    return String(month);
                case "DD":
                    return String(day).padStart(2, "0");
                case "D":
                    return String(day);
                case "HH":
                    return String(hour).padStart(2, "0");
                case "H":
                    return String(hour);
                case "mm":
                    return String(minute).padStart(2, "0");
                case "m":
                    return String(minute);
                case "ss":
                    return String(second).padStart(2, "0");
                case "s":
                    return String(second);
                default:
                    return token;
            }
        })
        .join("");
};
