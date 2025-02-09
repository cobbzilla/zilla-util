export async function packageVersion(pkgName: string): Promise<string | null> {
    try {
        const pkgJsonPath = await (import.meta.resolve?.(`${pkgName}/package.json`) ?? Promise.reject());
        const { version } = await import(pkgJsonPath);
        return version;
    } catch {
        try {
            const { version } = await import(`${pkgName}/package.json`, { assert: { type: "json" } });
            return version;
        } catch {
            return null;
        }
    }
}
