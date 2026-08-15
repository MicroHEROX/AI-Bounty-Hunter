# 02 · Free Storage: R2 Requires a Payment Method → D1 Photos
# 免费存储：R2 需要信用卡，照片改存 D1

## 2.1 R2 cannot be activated without a payment method

**Phenomenon · 现象**

```text
wrangler r2 bucket create bounty-hunter-media
→ ERROR: A request to the Cloudflare API (/accounts/<id>/r2/buckets) failed.
  Please enable R2 through the Cloudflare Dashboard. [code: 10042]
```

Clicking **Add R2 subscription** in the dashboard jumps straight to a checkout
page asking for a **card or PayPal** (billing address + payment method), even
though the plan itself is "$0.00 due now".

**Root cause · 原因**

R2 is a paid product: enabling it requires a payment method on file to cover
possible overage. It cannot be activated "fully card-free".

**Solution · 解决**

If the operator does not want to add a card, **do not use R2**. Store small
evidence photos directly in D1 (SQLite) as `data:image/...` URLs.

## 2.2 D1 row size limits photos to ~2 MB

**Phenomenon · 现象**

Uploading a phone photo (3–10 MB) as a base64 data URL fails or pushes the D1
row towards the ~2 MB per-row limit (`SQLITE_TOOBIG` / large request bodies).

**Root cause · 原因**

D1 (SQLite) has a row-size ceiling; base64 inflates binary data by ~33%.

**Solution · 解决**

Client-side image pipeline (implemented in `public/app.js`):

1. Read the file into an `<img>`, draw onto a `<canvas>` scaled to max 1280px.
2. Encode as JPEG, starting at quality 0.7; step quality down (−0.1) while the
   data URL is still over **650 KB** (min 0.2).
3. Server-side guard: reject any `photo` over **700,000 characters**.

Result: ≤ ~700 KB per photo, well inside D1 limits, and cheap to serve.

**Trade-off · 取舍**

| Approach | Cost | Max photo | Best for |
|---|---|---|---|
| D1 data URL | free | ~700 KB (compressed) | MVP, no payment method |
| R2 object storage | needs card on file | unlimited | production, high volume |
| External URL reference | free | unlimited | user already hosts images elsewhere |

**Related · 相关**

- [docs/glossary.md](../glossary.md) — "data URL" term.
- [docs/api.md](../api.md) — `POST /v1/claims/:id/deliver` photo constraint.
