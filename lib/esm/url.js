export const canonicalizeUrl = async (url) => {
    const original = url.trim();
    const u = new URL(original);
    u.protocol = u.protocol.toLowerCase();
    u.hostname = u.hostname.toLowerCase();
    if ((u.protocol === 'http:' && u.port === '80') || (u.protocol === 'https:' && u.port === '443'))
        u.port = '';
    u.pathname = u.pathname.replace(/\/{2,}/g, '/').replace(/%7E/gi, '~');
    const tracking = new Set([
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'utm_id',
        'gclid',
        'fbclid',
        'ref',
        'ref_src'
    ]);
    const kept = Array.from(u.searchParams.entries()).filter(([k]) => !tracking.has(k.toLowerCase()));
    kept.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    u.search = kept.length ? `?${new URLSearchParams(kept).toString()}` : '';
    const normalized = u.toString();
    const redirectChain = [];
    const maxRedirects = 5;
    let landing = normalized;
    try {
        let cur = normalized;
        for (let n = 0; n < maxRedirects; n += 1) {
            const r = await fetch(cur, { method: 'HEAD', redirect: 'manual' });
            const loc = r.status >= 300 && r.status < 400 ? r.headers.get('location') : null;
            if (!loc)
                break;
            cur = new URL(loc, cur).toString();
            redirectChain.push(cur);
        }
        if (redirectChain.length)
            landing = redirectChain[redirectChain.length - 1];
    }
    catch {
        landing = normalized;
    }
    let canonical = landing;
    try {
        const res = await fetch(landing, { method: 'GET', redirect: 'follow' });
        if (res.headers.get('content-type')?.includes('text/html')) {
            const html = await res.text();
            const found = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ??
                html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i)?.[1] ??
                html.match(/<meta[^>]*property=["']twitter:url["'][^>]*content=["']([^"']+)["']/i)?.[1];
            if (found)
                canonical = new URL(found, landing).toString();
        }
    }
    catch {
        /* ignore */
    }
    return { original, normalized, redirectChain, landing, canonical };
};
//# sourceMappingURL=url.js.map