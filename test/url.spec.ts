import { expect } from "chai"
import {
    createApp,
    createRouter,
    eventHandler,
    readBody, sendRedirect,
    toNodeListener
} from "h3"
import { createServer } from "http"
import { AddressInfo } from "net"
import { canonicalizeUrl, CanonicalizedUrl } from "../src/index.js"

describe("canonicalizeUrl", function () {
    let server: ReturnType<typeof createServer>
    let baseUrl = ""

    /* ------------------------------------------------------------------ */
    before(async () => {
        const router = createRouter()

        router.post(
            "/test",
            eventHandler(async event => {
                const body = await readBody<{ foo: string }>(event)
                return { ok: true, echoed: body }
            })
        )

        /* simple 200 page */
        const plainHandler = eventHandler(() => {
            return "<html><body>plain</body></html>"
        })
        router.get( "/plain", plainHandler)
        router.head( "/plain", plainHandler)

        /* redirect chain */
        const redirect = eventHandler(event => {
            return sendRedirect(event, "/final")
        })
        router.get( "/redirect1", redirect)
        router.head( "/redirect1", redirect)

        /* landing page with canonical link */
        const finalHtml =
            '<html><head><link rel="canonical" href="/real-final"></head><body>final</body></html>'
        const finalHandler = eventHandler(() => finalHtml)
        router.get( "/final", finalHandler)
        router.head( "/final", finalHandler)

        const app = createApp()
        app.use(router)
        server = createServer(toNodeListener(app))
        await new Promise<void>(resolve => server.listen(0, resolve))
        const { port } = server.address() as AddressInfo
        baseUrl = `http://127.0.0.1:${port}/`
    })

    /* ------------------------------------------------------------------ */
    after(async () => {
        await new Promise<void>((resolve, reject) =>
            server.close(err => (err ? reject(err) : resolve()))
        )
    })

    it("normalises a URL and strips tracking params", async () => {
        const url: string = `${baseUrl}plain?utm_source=x&b=2&a=1`
        const result: CanonicalizedUrl = await canonicalizeUrl(url)
        const expected: string = `${baseUrl}plain?a=1&b=2`
        expect(result.original).to.equal(url)
        expect(result.normalized).to.equal(expected)
        expect(result.redirectChain).to.be.empty
        expect(result.landing).to.equal(expected)
        expect(result.canonical).to.equal(expected)
    })

    it("follows redirects and extracts canonical URL", async () => {
        const url: string = `${baseUrl}redirect1`
        const result: CanonicalizedUrl = await canonicalizeUrl(url)
        const norm: string = url
        const landing: string = `${baseUrl}final`
        const canonical: string = `${baseUrl}real-final`
        expect(result.normalized).to.equal(norm)
        expect(result.redirectChain).to.deep.equal([landing])
        expect(result.landing).to.equal(landing)
        expect(result.canonical).to.equal(canonical)
    })
})
