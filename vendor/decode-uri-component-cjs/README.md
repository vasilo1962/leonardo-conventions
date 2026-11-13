# Expo 57 decoder compatibility

This is the MIT-licensed `decode-uri-component@0.5.0` source, distributed by
Sam Verschueren. The only source change is replacing its ESM default export
with a CommonJS `module.exports` function so `query-string@7` can call it.
No decoding logic is changed. The upstream license is retained in LICENSE.

Source: https://github.com/SamVerschueren/decode-uri-component/releases/tag/v0.5.0
Advisory: https://github.com/advisories/GHSA-vcc3-ghjq-m6fr

The scoped npm override replaces query-string's vulnerable decoder. Its file
path is relative to `node_modules/query-string`; the lockfile resolves it to
this repository directory. Verify with a clean `npm ci` and
`node scripts/check-url-decoder-security.mjs`.

Remove this compatibility copy when a supported Expo version uses a patched
decoder natively. Do not replace it with an older registry release.
