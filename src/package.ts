async function packageJsonUrl(startUrl: URL): Promise<URL | null> {
    let currentUrl = new URL(startUrl);

    while (true) {
        const packageUrl = new URL("package.json", currentUrl);
        try {
            const packageJson = await import(packageUrl.toString(), { assert: { type: "json" } });
            if (packageJson) return packageUrl; // Found package.json
        } catch {
            const parentUrl = new URL("..", currentUrl);
            if (parentUrl.toString() === currentUrl.toString()) break; // Stop if we reach the root
            currentUrl = parentUrl; // Move up one level
        }
    }
    return null; // Not found
}

export async function packageVersion(): Promise<string> {
    try {
        const packageUrl = await packageJsonUrl(new URL(import.meta.url));
        if (!packageUrl) throw new Error("package.json not found");

        const packageJson = await import(packageUrl.toString(), { assert: { type: "json" } });
        return packageJson.version;
    } catch (e) {
        console.error(`Error determining package version: ${e}`);
        return `error(${e})`;
    }
}
