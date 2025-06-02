export type CanonicalizedUrl = {
    original: string
    normalized: string
    redirectChain: string[]
    landing: string
    canonical: string
}

export const canonicalizeUrl = async (url: string): Promise<CanonicalizedUrl> => {
    const original: string = url.trim()

    const u: URL = new URL(original)
    u.protocol = u.protocol.toLowerCase()
    u.hostname = u.hostname.toLowerCase()
    if ((u.protocol === 'http:' && u.port === '80') || (u.protocol === 'https:' && u.port === '443')) u.port = ''
    u.pathname = u.pathname.replace(/\/{2,}/g, '/').replace(/%7E/gi, '~')

    const tracking: Set<string> = new Set([
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
    ])
    const kept: [string, string][] = Array.from(u.searchParams.entries()).filter(
        ([k]) => !tracking.has(k.toLowerCase())
    )
    kept.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    u.search = kept.length ? `?${new URLSearchParams(kept).toString()}` : ''

    const normalized: string = u.toString()

    const redirectChain: string[] = []
    const maxRedirects: number = 5
    let landing: string = normalized
    try {
        let cur: string = normalized
        for (let n: number = 0; n < maxRedirects; n += 1) {
            const r: Response = await fetch(cur, { method: 'HEAD', redirect: 'manual' })
            const loc: string | null = r.status >= 300 && r.status < 400 ? r.headers.get('location') : null
            if (!loc) break
            cur = new URL(loc, cur).toString()
            redirectChain.push(cur)
        }
        if (redirectChain.length) landing = redirectChain[redirectChain.length - 1]
    } catch {
        landing = normalized
    }

    let canonical: string = landing
    try {
        const res: Response = await fetch(landing, { method: 'GET', redirect: 'follow' })
        if (res.headers.get('content-type')?.includes('text/html')) {
            const html: string = await res.text()
            const found: string | undefined =
                html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ??
                html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i)?.[1] ??
                html.match(/<meta[^>]*property=["']twitter:url["'][^>]*content=["']([^"']+)["']/i)?.[1]
            if (found) canonical = new URL(found, landing).toString()
        }
    } catch {
        /* ignore */
    }

    return { original, normalized, redirectChain, landing, canonical }
}
