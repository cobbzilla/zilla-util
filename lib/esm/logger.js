export const DEFAULT_LOGGER = {
    isSilent: () => false,
    isAnyEnabled: () => true,
    isTraceEnabled: () => true,
    isVerboseEnabled: () => true,
    isDebugEnabled: () => true,
    isInfoEnabled: () => true,
    isWarningEnabled: () => true,
    isErrorEnabled: () => true,
    trace: (message, ...args) => console.trace(message, ...args),
    verbose: (message, ...args) => console.trace(message, ...args),
    debug: (message, ...args) => console.debug(message, ...args),
    log: (message, ...args) => console.log(message, ...args),
    info: (message, ...args) => console.info(message, ...args),
    warn: (message, ...args) => console.warn(message, ...args),
    error: (message, ...args) => console.error(message, ...args),
};
//# sourceMappingURL=logger.js.map