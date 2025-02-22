export type GenericLogger = {
    isDebugEnabled: () => boolean;
    isLogEnabled: () => boolean;
    isInfoEnabled: () => boolean;
    isWarningEnabled: () => boolean;
    isErrorEnabled: () => boolean;
    debug: (message: string, e?: Error) => void;
    log: (message: string, e?: Error) => void;
    info: (message: string, e?: Error) => void;
    warn: (message: string, e?: Error) => void;
    error: (message: string, e?: Error) => void;
};
