# 03 · Windows / Local Tooling Pitfalls
# Windows 本地工具链的坑

## 3.1 `wrangler d1 delete` crashes on Windows

**Phenomenon · 现象**

```text
wrangler d1 delete bounty-hunter-db --force
→ Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
```

The database is **not** deleted; `wrangler d1 list` still shows it.

**Root cause · 原因**

A wrangler/libuv bug on Windows when tearing down after the D1 delete call.
The CLI aborts before printing the final result.

**Solution · 解决**

Delete via the Cloudflare REST API with the wrangler OAuth token
(stored at `%APPDATA%\xdg.config\.wrangler\config\default.toml`):

```powershell
$cfg = Get-Content "$env:APPDATA\xdg.config\.wrangler\config\default.toml" -Raw
if ($cfg -match 'oauth_token\s*=\s*"([^"]+)"') {
  $token = $matches[1]
  curl.exe -s -X DELETE `
    "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/d1/database/<DB_ID>" `
    -H "Authorization: Bearer $token"
}
```

Verify with `wrangler d1 list`. (Same token works for any `/client/v4/` call.)

## 3.2 PowerShell 5.1: `Invoke-RestMethod` fails with SSL error

**Phenomenon · 现象**

```text
Invoke-RestMethod : 未能创建 SSL/TLS 安全通道 (could not create SSL/TLS secure channel)
```

**Root cause · 原因**

PowerShell 5.1 defaults to TLS 1.0/1.1; Cloudflare requires ≥ TLS 1.2.

**Solution · 解决**

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

…or simply use `curl.exe` (always TLS 1.2+) instead of `Invoke-RestMethod`.

## 3.3 `npm init` fails on a non-ASCII project directory name

**Phenomenon · 现象**

```text
npm error Invalid name: "人工智能赏金猎人平台"
```

**Root cause · 原因**

`npm init -y` derives the package name from the working directory name; npm
rejects non-ASCII / names with unsupported characters.

**Solution · 解决**

Write `package.json` manually (or `npm init` in a clean directory), then
`npm install`. Set `"name": "ai-bounty-hunter"` or similar — keep it
ASCII, lowercase, dash-separated.

**Related · 相关**

- [docs/solutions.md](../solutions.md) — methodology notes on keeping the
  release repo and the working directory separate.
