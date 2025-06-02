export type CanonicalizedUrl = {
    original: string;
    normalized: string;
    redirectChain: string[];
    landing: string;
    canonical: string;
};
export declare const canonicalizeUrl: (url: string) => Promise<CanonicalizedUrl>;
