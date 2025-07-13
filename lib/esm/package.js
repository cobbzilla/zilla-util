const packageJsonUrl = async (startUrl) => {
    let currentUrl = new URL(startUrl);
    while (true) {
        const packageUrl = new URL("package.json", currentUrl);
        try {
            const packageJson = await import(packageUrl.toString(), { assert: { type: "json" } });
            if (packageJson)
                return packageUrl; // Found package.json
        }
        catch {
            const parentUrl = new URL("..", currentUrl);
            if (parentUrl.toString() === currentUrl.toString())
                break; // Stop if we reach the root
            currentUrl = parentUrl; // Move up one level
        }
    }
    return null; // Not found
};
export const packageVersion = async (importMetaUrl = import.meta.url, logger) => {
    try {
        const packageUrl = await packageJsonUrl(new URL(importMetaUrl));
        if (!packageUrl)
            throw new Error("package.json not found");
        const packageJson = await import(packageUrl.toString(), { assert: { type: "json" } });
        return packageJson.version;
    }
    catch (e) {
        const msg = `packageVersion importMetaUrl=${importMetaUrl} error determining package version: error=${e}`;
        if (logger) {
            logger.error(msg, e);
        }
        else {
            console.error(msg);
        }
        return undefined;
    }
};
//# sourceMappingURL=package.js.map