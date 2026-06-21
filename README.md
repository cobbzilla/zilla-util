# zilla-util

Simple utility library for TypeScript and modern JavaScript projects.

`zilla-util` provides small helpers for arrays, strings, dates, object traversal, retries, caches, hashing, URL cleanup, WebCrypto operations, and related application plumbing. The package is ESM-first and exports TypeScript declarations from its built output.

## Installation

```sh
npm install zilla-util
```

```sh
pnpm add zilla-util
```

## Usage

Import utilities from the package root:

```ts
import { retry, sleep, sluggize, LRUCache, deepGet } from "zilla-util";

const slug = sluggize("Hello, World!", "-");

const value = deepGet<string>(
    {
        user: {
            profile: {
                name: "Ada",
            },
        },
    },
    "user.profile.name"
);

const cache = new LRUCache<string, number>({ maxSize: 100, maxAge: 60_000 });
cache.set("answer", 42);

await retry(async () => {
    await sleep(100);
    return "ok";
});
```

The package also exposes a subpath export for array helpers:

```ts
import { containsAll } from "zilla-util/array";
```

## What's Included

### Arrays

- Set and inclusion helpers: `setsEqual`, `containsAll`, `isAnyTrue`
- Collection helpers: `cartesianProduct`, `asyncFilter`, `shuffleArray`, `shuffleNumbers`
- Deduplication helpers: `deduplicateArray`, `deduplicateArrayByName`, `firstByProperty`
- Sorted set classes: `SortedSet`, `SortedIdSet`

### Strings and Formatting

- Case and path helpers: `capitalize`, `uncapitalize`, `basefilename`, `ext`, `basefilenameWithoutExt`
- Slug and case conversion helpers: `sluggize`, `hyphenate`, `camel2kebab`, `camel2snake`, `kebab2camel`, `snake2camel`
- Date string helpers: `dateAsYYYYMMDD`, `dateAsUTCYYYYMMDD`, `nowAsYYYYMMDD`, `dateAsYYYYMMDDHHmmSS`
- Token and ID helpers: `uuidv4`, `randomSafeToken`, `randomSuperSafeToken`, `randomDigits`
- JSON and text helpers: `safeStringify`, `sortedStringify`, `trimSpaces`, `countVisibleChars`
- ANSI and browser CSS style constants: `ANSI`, `CSS`

### Dates and Time

- UTC date formatter: `formatDate`
- Clock abstraction: `ZillaClock`, `DEFAULT_CLOCK`, `MockClock`, `mockClock`
- Async timing helpers: `sleep`, `nap`, `delay`
- Duration parsing: `parseSimpleTime`, with values such as `500`, `2s`, `5m`, `1h`, and `1d`

### Deep Objects

- Path parsing and traversal: `parseDeep`, `deepGet`, `deepUpdate`
- Comparison helpers: `deepEquals`, `deepAtLeastEquals`, `deepEqualsForFields`
- Object cleanup and filtering: `stripNonAlphaNumericKeys`, `filterObject`, `filterProperties`
- Empty checks: `isEmpty`, `isNotEmpty`
- Immutable proxy wrapper: `immutify`
- Recursive transforms: `copyWithRegExp`, `deepTransform`

Deep paths support dot notation and array indexes:

```ts
import { deepGet, deepUpdate } from "zilla-util";

const obj = { users: [{ name: "Ada" }] };

deepGet<string>(obj, "users[0].name"); // "Ada"
deepUpdate(obj, "users[].name", "Grace"); // appends an object to users
```

### Cache and Retry

- `LRUCache` provides bounded in-memory caching with optional max age and touch-on-get behavior.
- `withLRUCache` memoizes sync or async functions.
- `retry` retries async functions with configurable attempts, exponential backoff, and retry filtering.

```ts
import { retry, withLRUCache } from "zilla-util";

const cachedLookup = withLRUCache(async (id: string) => {
    return fetch(`/api/items/${id}`).then((r) => r.json());
});

const result = await retry(() => cachedLookup("abc"), {
    maxAttempts: 5,
    backoffBaseMillis: 250,
    backoffMultiplier: 2,
});
```

### Encoding, Hashing, and Crypto

- URL-safe base64 helpers: `base64Encode`, `base64Decode`
- SHA-256 helpers: `sha256`, `shaLevels`, `dirLevels`
- WebCrypto RSA helpers: `CryptoUtil.generateKeyPair`, `CryptoUtil.encrypt`, `CryptoUtil.decrypt`, `CryptoUtil.sign`, `CryptoUtil.verifySignature`

`CryptoUtil` uses `globalThis.crypto.subtle`, so it requires a WebCrypto-capable runtime.

### URLs

- `normalizeUrl` normalizes valid URL strings with the platform `URL` implementation.
- `canonicalizeUrl` lowercases protocol/host, removes common tracking parameters, follows redirects, and inspects HTML canonical metadata when available.

### Other Utilities

- `substContext` replaces `{{variable}}` placeholders in strings, arrays, and objects.
- `wrapError` wraps unknown thrown values with contextual `Error` objects.
- `GenericLogger` and `DEFAULT_LOGGER` define a small logger interface.
- Message transport types are available through `ZillaMsgTransportType`, `ZillaMessage`, and `ZillaMsgTransport`.
- `packageVersion` attempts to discover the nearest `package.json` version from an import URL.

## Development

Install dependencies:

```sh
pnpm install
```

Build the package:

```sh
pnpm build
```

Run tests:

```sh
pnpm test
```

Run linting:

```sh
pnpm lint
```

Run the full release check:

```sh
pnpm release
```

## License

Apache-2.0. See [LICENSE.txt](LICENSE.txt).
