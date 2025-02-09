export async function packageVersion(pkgName) {
    try {
        const pkgJsonPath = await (import.meta.resolve?.(`${pkgName}/package.json`) ?? Promise.reject());
        const { version } = await import(pkgJsonPath);
        return version;
    }
    catch {
        try {
            const { version } = await import(`${pkgName}/package.json`, { assert: { type: "json" } });
            return version;
        }
        catch {
            return null;
        }
    }
}
//# sourceMappingURL=package.js.map