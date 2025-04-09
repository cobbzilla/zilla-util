export type GenericLogger = {
    isSilent: () => boolean;
    isAnyEnabled: () => boolean;
    isTraceEnabled: () => boolean;
    isVerboseEnabled: () => boolean;
    isDebugEnabled: () => boolean;
    isInfoEnabled: () => boolean;
    isWarningEnabled: () => boolean;
    isErrorEnabled: () => boolean;
    trace: (message: string, ...args: unknown[]) => void;
    verbose: (message: string, ...args: unknown[]) => void;
    debug: (message: string, ...args: unknown[]) => void;
    log: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
};
