export const capitalize = (s) => s && s.length > 0 ? s.substring(0, 1).toUpperCase() + s.substring(1) : "";
export const uncapitalize = (s) => s && s.length > 0 ? s.substring(0, 1).toLowerCase() + s.substring(1) : "";
export const basefilename = (s) => {
    if (!s)
        return s; // return null/undefined as-is
    // drop trailing slashes
    while (s.endsWith("/")) {
        s = s.substring(0, s.length - 1);
    }
    const i = s ? s.lastIndexOf("/") : -1;
    return i === -1 ? s : s.substring(i + 1);
};
export const basefilenameWithoutExt = (s) => {
    s = basefilename(s);
    if (!s)
        return s; // return null/undefined as-is
    // drop trailing dots
    while (s.endsWith(".")) {
        s = s.substring(0, s.length - 1);
    }
    const i = s ? s.lastIndexOf(".") : -1;
    return i === -1 ? s : s.substring(0, i);
};
