# VAPT Round 1 — Frontend Remediation Status

Companion to [`Gophygital-VAPT-Round-1.md`](./Gophygital-VAPT-Round-1.md).
Scope: what was fixed **in this repository** (`fm-matrix-revamp`), what is still pending here, and what cannot be fixed here at all.

**Verification:** `npx tsc --noEmit` → 0 errors. `npm run build` → ✓ built in 3m 33s. No behavioural regressions expected (rationale per item below).

---

## Headline numbers

| | Count |
|---|---|
| Total findings across both reports | 45 (16 API + 29 Web) |
| Root causes those collapse into | ~8 |
| **Fixable in this repo** | **4 findings, partially** |
| **Backend / infra only** | **38 findings** |
| Fixed now | 2 (1 substantially, 1 defense-in-depth) |
| Pending in this repo | 2 (need refactor or product decision) |
| **Token-in-URL sites removed** | **81 of 203 (40%)** |

> The blunt summary: **this is overwhelmingly a backend engagement.** 14 of 45 findings — including 5 of the 6 Criticals — are missing object-level authorization, which only the API can fix. The frontend surface is genuinely small.

---

## ✅ COMPLETED — fixed in this repo

### 1. Access token removed from URL query strings (API §5.5 / Web §5.6) — *81 of 203 sites (40%)*

**What was wrong:** URLs were built as `...?site_id=6&from_date=...&access_token=<JWT>`. Tokens in URLs leak via browser history, Referer headers, proxy/CDN/server logs.

**Why these 19 were safe to change:** each of these requests **already sent `Authorization: Bearer <token>` on the same `fetch()` call** — the token in the URL was pure duplication. The auditor confirmed this explicitly in API §5.5:

> *"During testing, authentication continued to function without the URL parameter, indicating that the Authorization header is used for authentication."*

So removal changes nothing functionally; the request authenticates identically.

**Done in two passes:**

- **Pass 1 (19 sites)** — analytics/export components with an obvious adjacent auth header.
- **Pass 2 (62 sites)** — the `*AnalyticsAPI.ts` / `*DownloadAPI.ts` / `*ExportService.ts` service layer. My first classifier wrongly flagged these as "download-dependent" because it saw `link.href = …` nearby — but that is the **blob object-URL**, not the API URL. These services already do `fetch(url, { headers: { Authorization } })` → `blob()` → synthetic `<a>` click, so the URL token was redundant here too.

**Files changed (19 files, 81 sites):**

| File | Sites |
|---|---|
| `src/services/assetAnalyticsDownloadAPI.ts` | 10 |
| `src/services/inventoryAnalyticsDownloadAPI.ts` | 10 |
| `src/components/InventoryAnalyticsCard.tsx` | 8 |
| `src/services/ticketAnalyticsDownloadAPI.ts` | 7 |
| `src/services/assetAnalyticsAPI.ts` | 6 |
| `src/services/taskAnalyticsAPI.ts` | 4 |
| `src/services/taskAnalyticsDownloadAPI.ts` | 4 |
| `src/services/scheduleAnalyticsAPI.ts` | 3 |
| `src/components/FBAnalyticsComponents.tsx` | 3 |
| `src/services/permitToWorkAnalyticsAPI.ts`, `taskExportService.ts`, `customFormsAPI.ts`, `fbAnalyticsAPI.ts`, `PermitToWorkDashboard.tsx`, `EmployeeUnifiedCalendar.tsx`, `RestaurantOrdersTable.tsx`, `EmployeeFnb.tsx`, `IncidentNewDetails.tsx`, `ViewTrainingPerformance.tsx` | 1–2 each |

Also removed **27 `accessToken` variable declarations** left dead by the strip (4 service files). The now-unused private `getAccessToken()` helpers in those 4 files were left in place — they are module-private and tree-shaken out of the bundle; removing them is cosmetic and carried no benefit.

**Verified:** no malformed URLs (`?&`, `&&`, trailing `?`) in the diff; `tsc --noEmit` clean; `npm run build` ✓.
**Count:** `access_token=` occurrences in `src/` went **203 → 122** (**81 removed, 40%**).

---

### 2. Account-enumeration messages on login (Web §5.28 / §5.29) — *defense-in-depth only*

**What changed:** `src/pages/LoginPage.tsx` (3 sites — 2 toasts + 1 inline message). Replaced:

> ~~"No organizations found for this email address."~~

with a neutral message that does not confirm whether an email/organization is registered.

> ### ⚠️ Read this before reporting it as fixed
> **This does NOT close findings 5.28/5.29.** The actual enumeration vector is the **API response** from `/api/users/get_organizations_by_email?email=<email>`, which returns an empty vs. populated list. An attacker calls that endpoint directly and never sees the UI. Web §5.3 independently flags this same endpoint as an enumeration vector.
>
> **The backend must return generic responses with identical status codes, bodies, and response timing.** Until then, treat this as cosmetic hardening only.

**Not changed, deliberately:**
- `src/pages/ForgotPasswordPage.tsx` — it renders `response.message` / `error.message` straight from the API. Masking those wholesale would also swallow legitimate errors (network failures, validation). The "No user found" / "No organisation found" strings cited in §5.28 originate **server-side**. Backend fix.
- `src/components/CheckHierarchy.tsx` — "No user found for the provided email/mobile" is an internal admin hierarchy-lookup tool, not an auth surface. Not an enumeration vector for unauthenticated attackers, and genericising it would hurt legitimate admin UX.

---

## ⏳ PENDING — fixable in this repo, but needs work or a decision

### 3. Remaining 122 `access_token=` occurrences (API §5.5 / Web §5.6)

Every remaining site was individually classified. **None of them is a safe mechanical strip** — each needs either a code change that alters the request, or backend support.

| Category | Sites | Why it can't just be stripped |
|---|---|---|
| **A — Browser-navigation downloads** (`window.open(url)`, `window.location.href = url`, `<img src={url}>`) | **7** | The browser navigates to the URL itself and **cannot attach an `Authorization` header**. Stripping the token breaks the download outright. |
| **C — Token is the *only* credential** (`fetch`/`axios` with **no** auth header) | **104** across 42 files | The request authenticates *solely* via the query param. Stripping it returns 401. Fixing = **add** an `Authorization` header, then strip — a behaviour change per call site needing QA. |

**Category A — the 7 that must keep the token until backend provides signed URLs:**

| File | Line | Consumed via |
|---|---|---|
| `src/features/embedded/EmbeddedView.tsx` | 28 | `<img src>` / embed contract (third-party — verify before touching) |
| `src/components/asset-details/TicketTab.tsx` | 212 | `window.open` |
| `src/pages/VendorClubDashboard.tsx` | 214 | `link.href` |
| `src/pages/VendorPage.tsx` | 214, 665 | `link.href` |
| `src/pages/PatrollingDetailPage.tsx` | 823, 853 | `window.open` |
| `src/services/assetExportService.ts` | 127 | `window.location.href` |

**Category C — heaviest files:** `inventoryAnalyticsAPI.ts` (10), `amcAnalyticsDownloadAPI.ts` (9), `amcAnalyticsAPI.ts` (8), `PurchaseOrderCreatePage.tsx` (7), `ticketAnalyticsAPI.ts` (7), `Accounting/PurchaseOrderEdit.tsx` (6), `EmployeeDashboard.tsx` (5), `AdminCompass/Jobs/*` (~9 via the shared `buildApiUrl` helper).

> Note `src/pages/AdminCompass/Jobs/apiClient.ts:32` — a shared `buildApiUrl()` that puts `access_token` first in every URL for the whole Jobs module. Fixing that one helper (add auth header, drop the param) would clear ~9 sites at once, but it changes every Jobs API call, so it needs a focused QA pass on that module.

**Two ways forward (needs your call):**

- **Option A — frontend refactor.** For category C: add `Authorization: Bearer` to each call and drop the param. For category A: introduce a shared `downloadWithAuth(url, filename)` helper (`fetch` + auth header → `blob()` → object-URL → synthetic `<a>` click) — the exact pattern the `*DownloadAPI.ts` services already use, so there is a proven in-repo template. *Risk:* medium; ~111 call sites across 42 files, each needing QA. **Depends on the backend accepting header auth on these endpoints** — true for the endpoints already migrated, unverified for the rest.
- **Option B — backend issues short-lived signed download URLs** (~60s TTL, single-use) for category A, and confirms header auth for category C. *Risk:* low on the frontend, and it fixes the same class of issue for mobile clients.

**Recommendation: Option B for category A** (browser navigation genuinely cannot send headers — no frontend trick avoids that), **Option A for category C**, done module by module with QA, starting with `AdminCompass/Jobs/apiClient.ts` for the best ratio of sites-fixed to risk.

Reproduce the current inventory: `grep -rn "access_token=" src | wc -l`

---

### 4. Bearer token in Local Storage (Web §5.22) — *cannot be fixed frontend-only*

**Confirmed present:** `src/utils/auth.ts:99` (`TOKEN: "token"`), written `auth.ts:142`, read `auth.ts:147,229`, cleared `auth.ts:257`. Also read in `src/utils/withoutTokenBase.ts` and `src/components/Header.tsx:218`.

**Why it matters more than its "Medium" rating suggests:** Web §5.9 and §5.10 are **confirmed stored-XSS** via PDF upload. Stored XSS + token readable from JS = full session theft. These findings compound; rate this pair higher than either alone.

**The fix requires backend cooperation:** move the session to a `Secure` + `HttpOnly` + `SameSite` cookie. The frontend cannot set `HttpOnly` — by definition, only the server can. This is a coordinated auth-flow change touching login, refresh, logout, the axios interceptors (`withoutTokenBase.ts`, `apiClient.ts`), and the embedded/mobile token flows.

**Available now as interim mitigation (not yet done — say the word):**
- Tighten the CSP in `index.html` (reduces XSS→token-theft likelihood).
- Shorten token TTL + implement refresh rotation (backend).
- Token clear on logout is **already implemented** (`auth.ts:257`).

> ⚠️ Note the report contradicts itself here: pass case §6.1 claims *no* tokens were found in client-side storage. Finding §5.22 is correct — I verified it in the code. Raise this with ARM Innovations.

---

## ❌ BACKEND / INFRASTRUCTURE ONLY — nothing this repo can do

| # | Finding(s) | Owner | Note |
|---|---|---|---|
| 1 | **All 14 IDOR/BOLA findings** — API 5.1, 5.3, 5.4, 5.6, 5.13; Web 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8, 5.11, 5.13 | **Backend** | **Highest priority. 5 of 6 Criticals.** Every endpoint taking a client-supplied ID must verify ownership/tenancy server-side. No frontend change can substitute — the attacker uses Burp/Postman, not the UI. |
| 2 | API 5.2 — Spree API key accepted as Bearer token | **Backend** | Critical. Also **rotate all API keys**. |
| 3 | Web 5.2 — MSafe report `company_id` cross-tenant leak | **Backend** | Critical. Leaks another org's employee/contractor PII as an Excel file. |
| 4 | API 5.7/5.9, Web 5.20 — EXIF metadata (incl. **GPS**) not stripped | **Backend** | Strip on upload / re-encode. |
| 5 | API 5.8, Web 5.9/5.10 — Stored XSS via PDF upload | **Backend** | Reject/sanitize active content; serve `Content-Disposition: attachment` + `X-Content-Type-Options: nosniff`. |
| 6 | API 5.11/5.12, Web 5.19/5.25 — missing rate limiting & anti-replay | **Backend** | |
| 7 | API 5.15, Web 5.23/5.26 — client-side-only validation | **Backend** | Auditor calls Web 5.23 **systemic**. Frontend validation already exists; the issue is the server *accepting* bypassed values. Frontend genuinely cannot fix this. |
| 8 | Web 5.12 — **Clickjacking** on login | **Infra (nginx)** | Needs `X-Frame-Options: DENY` or CSP `frame-ancestors`. **See the warning below — do not "fix" this with frame-busting JS.** |
| 9 | Web 5.16 — missing security headers | **Infra (nginx)** | See CSP note below. |
| 10 | Web 5.14/5.24 — session survives logout & account lockout | **Backend** | Needs server-side token revocation/blacklist. |
| 11 | Web 5.15 — internal IP `172.31.16.75` disclosed | **Infra** | |
| 12 | Web 5.17/5.27, API 5.14 — server version headers | **Infra** | `server_tokens off;`, drop `X-Powered-By`. |
| 13 | Web 5.18 — SSH weak SHA-1 MACs | **Infra** | |
| 14 | Web 5.21 — byte-range DoS (CVE-2011-3192) | **Infra** | Patch/upgrade web server. |
| 15 | API 5.10 — CORS `*` + `credentials: true` | **Backend** | Auditor notes **all** endpoints are misconfigured, not just the one listed. |
| 16 | API 5.16 — internal `/tmp/RackMultipart...` path in error | **Backend** | Also returns HTTP 200 on failure; should be 4xx. |

---

## 🚫 Two things I deliberately did NOT do

**1. No frame-busting JavaScript for Clickjacking (Web §5.12).**
This app has a **legitimate embedded mode** — `src/utils/embeddedMode.ts` reads `?embedded=true`, and `src/features/embedded/EmbeddedView.tsx` is designed to be iframed by partner sites. A blanket frame-buster would **break every embedded deployment**. Making it conditional on `?embedded=true` would be trivially bypassed by an attacker appending that same parameter — illusory security at the cost of real breakage.
**Correct fix:** nginx `X-Frame-Options` / CSP `frame-ancestors` with an explicit allowlist of legitimate embedding origins.

**2. No mass automated strip of the remaining 122 `access_token=` sites.**
Classification went wrong twice, in both directions — both caught before any edit landed:
- **Too permissive:** an early heuristic matched an `Authorization` header anywhere within ±40 lines, producing false positives like `AmenityBookingSetupClubDetails.tsx:205` (an `axios.get` with **no** auth header) and `assetExportService.ts:127` (a `window.location.href` navigation) — the header it matched belonged to a *neighbouring function*. Stripping those would have broken a QR-code PDF download and the digital-register export.
- **Too conservative:** the same pass rejected the whole `*DownloadAPI.ts` service layer because it saw `link.href = …` nearby — but that is the **blob object-URL**, not the API URL. That single mistake was hiding 62 safe fixes.

Final rule applied: strip only when the auth header sits on the **same call expression** as the tokenised URL, and that URL is never passed to `window.open` / `.href` / `<img src>`. All 81 edits were verified against that rule, plus a malformed-URL scan of the diff, `tsc --noEmit`, and a full production build.

---

## CSP clarification worth sending to the auditor

Finding §5.16 lists **Content-Security-Policy as absent**. Nuance:

- `index.html` **does** define a CSP via `<meta http-equiv="Content-Security-Policy">` (one active tag; two others are empty/commented out).
- But the auditor tests **HTTP response headers**, and a `<meta>` CSP is not one — so from their vantage point the finding is *technically accurate*.
- More importantly, a meta-tag CSP is **strictly weaker**: `frame-ancestors` is **ignored** in meta form. That is precisely the directive needed for Clickjacking §5.12.

**Action:** move CSP to a real nginx response header. Keep the meta tag as a fallback if you like, but it cannot satisfy §5.12 or §5.16 on its own.

---

## Suggested sequencing

1. **Now (Critical, backend):** object-level authorization across all ID-taking endpoints — start with cross-tenant leaks (Web 5.2 MSafe `company_id`, Web 5.4 vendor banking data, API 5.1 user deletion).
2. **Now (Critical, backend):** stop accepting the Spree API key as a Bearer token; rotate keys.
3. **Next (backend):** upload pipeline — EXIF stripping + PDF active-content rejection + `Content-Disposition: attachment`. Closes 6 findings and defuses the XSS→token-theft chain.
4. **Next (infra):** nginx header pass — `frame-ancestors`/`X-Frame-Options`, HSTS, `server_tokens off`, `X-Content-Type-Options`, `Referrer-Policy`; fix CORS wildcard+credentials.
5. **Then (joint):** decide Option A vs B for the remaining download-URL tokens (item 3 above); plan the HttpOnly-cookie migration (item 4).
6. **Then (backend):** generic auth/reset responses with constant timing — this is what actually closes 5.28/5.29.

---

## Open questions to put to ARM Innovations

1. Resolve the three §5↔§6 self-contradictions: **5.22↔6.1**, **5.14↔6.16**, **5.16↔6.17** — with exact host, path, and timestamp for each test.
2. Are **5.17 and 5.27** one finding filed twice? They differ only in severity (Medium vs Low).
3. API §5.10 says "all [endpoints] are misconfigured with CORS" — please supply the full list; the summary table names only one.
4. §6.5 could not verify **encryption at rest**. Is a server-side review in Round 2 scope?
5. Both reports targeted **UAT/staging** (`fm-uat-api.lockated.com`, `web.gophygital.work`). Does production carry the same header/CORS/TLS configuration?

---

*Last updated after the frontend remediation pass. `tsc` clean, production build clean.*
