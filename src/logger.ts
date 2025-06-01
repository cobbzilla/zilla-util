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

export const DEFAULT_LOGGER: GenericLogger = {
    isSilent: () => false,
    isAnyEnabled: () => true,
    isTraceEnabled: () => true,
    isVerboseEnabled: () => true,
    isDebugEnabled: () => true,
    isInfoEnabled: () => true,
    isWarningEnabled: () => true,
    isErrorEnabled: () => true,
    trace: (message: string, ...args: unknown[]) => console.trace(message, ...args),
    verbose: (message: string, ...args: unknown[]) => console.trace(message, ...args),
    debug: (message: string, ...args: unknown[]) => console.debug(message, ...args),
    log: (message: string, ...args: unknown[]) => console.log(message, ...args),
    info: (message: string, ...args: unknown[]) => console.info(message, ...args),
    warn: (message: string, ...args: unknown[]) => console.warn(message, ...args),
    error: (message: string, ...args: unknown[]) => console.error(message, ...args),
}
