export type GenericLogger = {
    isSilent: () => boolean;
    isAnyEnabled: () => boolean;
    isTraceEnabled: () => boolean;
    isVerboseEnabled: () => boolean;
    isDebugEnabled: () => boolean;
    isInfoEnabled: () => boolean;
    isWarningEnabled: () => boolean;
    isErrorEnabled: () => boolean;
    trace: (message: string, e?: Error) => void;
    verbose: (message: string, e?: Error) => void;
    debug: (message: string, e?: Error) => void;
    log: (message: string, e?: Error) => void;
    info: (message: string, e?: Error) => void;
    warn: (message: string, e?: Error) => void;
    error: (message: string, e?: Error) => void;
};
