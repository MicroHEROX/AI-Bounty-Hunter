# 01 · Deployment & Domain Access Pitfalls
# 部署与域名访问的坑

## 1.1 First deploy requires a workers.dev subdomain

**Phenomenon · 现象**

`wrangler deploy` fails with:

> You need to register a workers.dev subdomain before publishing to workers.dev

**Root cause · 原因**

The account has never registered its account-level subdomain
(`<account>.workers.dev`). It is a one-time, account-wide registration.

**Solution · 解决**

- Run `wrangler login` first (OAuth, see [01-… → section 1.1 of this file](#11)); then
- Visit `https://dash.cloudflare.com/<account_id>/workers/subdomain`
  (or the Workers & Pages onboarding page) and pick a globally-unique name, or
- Re-run `wrangler deploy` — it prints the exact registration URL to use.

Deployed URL format: `https://<worker-name>.<account-subdomain>.workers.dev`.

## 1.2 SSL error right after changing the subdomain

**Phenomenon · 现象**

After changing the account subdomain (Workers & Pages → Account Details →
Subdomain), the new URL briefly shows:

> ERR_SSL_VERSION_OR_CIPHER_MISMATCH — 此网站无法提供安全连接

The worker itself is healthy; the edge certificate for the new hostname is
still propagating.

**Root cause · 原因**

Cloudflare must issue/serve a TLS certificate for
`*.<new-subdomain>.workers.dev` before the hostname can terminate TLS. This is
documented in the dashboard: *"It might take a few minutes for
\*.&lt;new&gt;.workers.dev to accept requests."*

**Solution · 解决**

Wait 2–5 minutes and retry. Do not re-deploy or change config — the worker is
already live. If it persists beyond ~10 minutes, check
`https://dash.cloudflare.com/<account>/workers/subdomain` to confirm the change
committed.

## 1.3 workers.dev is DNS-poisoned on mainland-China ISPs

**Phenomenon · 现象**

From a mainland-China network:

```text
nslookup your-worker.your-subdomain.workers.dev
→ Addresses: 2a03:2880:f10c:83:face:b00c:0:25de   (Facebook IPv6 range)
             103.39.76.66                          (not Cloudflare)
```

`curl` fails with connection timeouts; the site may still open fine in a
browser.

**Root cause · 原因**

The ISP resolver returns forged records for `*.workers.dev` (and often for
DoH endpoints such as `dns.google` / `cloudflare-dns.com`). Plain DNS clients
(`nslookup`, `curl`, `Invoke-RestMethod`) are affected.

**Solution · 解决**

- Browsers that use **DNS-over-HTTPS (DoH)** resolve correctly and work
  unchanged — Chrome/Edge enable DoH automatically or via
  `chrome://settings/security` → "Use secure DNS".
- CLI access from such networks: force a Cloudflare anycast IP with
  `curl --resolve <host>:443:<cloudflare-anycast-ip> https://<host>/...`.
- Long term: put a **custom domain** on Cloudflare (add a zone, then a
  Workers custom route) — custom domains are not affected by workers.dev
  poisoning. In the mainland market this is the difference between
  "users can open the site" and "users cannot".

**Related · 相关**

- [docs/api.md](../api.md) — all endpoints are served on the same hostname.
