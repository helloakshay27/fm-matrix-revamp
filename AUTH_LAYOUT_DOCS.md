# Documentation: `auth.ts` and `Layout.tsx`

## `src/utils/auth.ts`

`auth.ts` contains browser-side authentication helpers. It manages user data, tokens, backend base URLs, organization lookup, login, OTP verification, password reset, and auth cleanup.

### Storage Keys

| Key | localStorage name | Use |
| --- | --- | --- |
| `AUTH_KEYS.USER` | `user` | Saved logged-in user JSON |
| `AUTH_KEYS.TOKEN` | `token` | Auth/access token |
| `AUTH_KEYS.TEMP_PHONE` | `temp_phone` | Temporary phone for OTP/reset |
| `AUTH_KEYS.TEMP_EMAIL` | `temp_email` | Temporary email for OTP/reset |
| `AUTH_KEYS.BASE_URL` | `baseUrl` | Backend domain/base URL |

### User and Token Working

- `saveUser(user)` stores the user as JSON.
- `getUser()` reads and parses the saved user. It returns `null` if missing.
- `saveToken(token)` stores the token.
- `getToken()` returns the token or `null`.
- `isAuthenticated()` returns `true` only when both user and token exist.

Condition:

- If either user or token is missing, the app treats the user as unauthenticated.
- Invalid JSON in `user` can break `getUser()` because it directly uses `JSON.parse`.

### Base URL Working

- `normalizeBaseUrl(url)` cleans the URL and forces `https://`.
- `stripProtocol(url)` removes `http://` or `https://`.
- `saveBaseUrl(baseUrl)` stores only the domain, without protocol.
- `getBaseUrl()` returns the saved base URL with protocol.
- `getBaseUrlDomain()` returns only the domain.

Reason:

- Some old code manually adds `https://`, so `saveBaseUrl()` stores domain-only values to avoid `https://https://...`.

### Lock Account

`fetchLockAccount()`:

1. Reads `baseUrl` and `token`.
2. If either is missing, it stops.
3. Calls `<baseUrl>/get_lock_account.json`.
4. Sends `Authorization: Bearer <token>`.
5. Saves `lock_account_id` if the API returns `data.lock_account.id`.

Condition:

- API failure is ignored silently because lock account data is not critical.

### Organization Lookup

`getOrganizationsByEmail(email)` chooses an API host based on the current hostname.

| Host condition | API host |
| --- | --- |
| Oman/FM site | `https://uat.lockated.com` |
| VI/web/lockated/community site | `https://live-api.gophygital.work` |
| Dev site | `https://dev-api.lockated.com` |
| Pulse site | `https://pulse-api.lockated.com` |
| Club site | `https://club-uat-api.lockated.com` |
| Panchshil Pulse UAT | `https://pulse-uat-api.panchshil.com` |
| Panchshil Club | `https://recess-club-api.panchshil.com` |
| Panchshil Pulse production | `https://pulse-api.panchshil.com` |
| Default | `https://uat.lockated.com` |

It calls:

```txt
/api/users/get_organizations_by_email.json?email=<email>
```

Condition:

- Non-OK response throws `Failed to fetch organizations`.
- Success returns `data.organizations || []`.

### Login

`loginUser(email, password, baseUrl, organizationId?)` posts to:

```txt
https://<baseUrl>/api/users/sign_in.json
```

Request body:

```ts
{
  email,
  password,
  organization_id // only when organizationId exists
}
```

Condition:

- Success returns API data.
- Failure throws an error with message, status, and response data.
- `baseUrl` should be domain-only because this function adds `https://`.

### OTP

`loginWithPhone(phone, password)` is currently simulated. It waits, stores `temp_phone`, and returns success.

`verifyOTP(otp)`:

1. Reads `temp_email`, `temp_token`, `baseUrl`, and `token`.
2. Requires `temp_email`.
3. Requires `baseUrl`.
4. Posts to `https://live-api.gophygital.work/verify_code.json`.
5. Sends `{ email, otp }`.
6. Adds `Authorization` only when `temp_token` exists.
7. Sets `verified = true` if the API returns `code === 200` or `access_token`.
8. Clears temp email/token after successful verification.

Condition:

- Missing email throws a session expired error.
- Missing base URL throws a base URL error.
- Failed response throws `OTP verification failed`.
- The function checks `baseUrl` but uses a hardcoded VI API URL.

### Forgot Password

`sendForgotPasswordOTP(emailOrMobile)`:

- requires `baseUrl`,
- sends `request_otp: 1`,
- stores email in `temp_email` or phone in `temp_phone`,
- sends the value as `mobile`, even when it is an email.

`verifyForgotPasswordOTPAndResetPassword(...)`:

- requires `baseUrl`,
- checks password and confirm password match,
- sends OTP and new password to the forgot password endpoint,
- clears temp email/phone on success.

`verifyForgotPasswordOTP(otp)` and `resetPassword(...)` are local compatibility validators. They do not call an API.

### Clear Auth

`clearAuth()` removes known auth values and then calls `localStorage.clear()`.

Condition:

- This clears all localStorage, including non-auth values like sidebar state, selected company, site, filters, or cached preferences.

## `src/components/Layout.tsx`

`Layout.tsx` is the main application shell. It decides which header, sidebar, dynamic header, protection layer, and content spacing should be used.

It renders nested route pages using:

```tsx
<Outlet />
```

### Main Inputs

| Source | Values |
| --- | --- |
| `useLayout()` | `isSidebarCollapsed`, `currentSection`, `getLayoutByCompanyId` |
| `useActionLayout()` | `isActionSidebarVisible` |
| Redux project state | `selectedCompany` |
| Redux site state | `selectedSite` |
| Router location | `pathname`, `search` |
| `getUser()` | current user email |
| localStorage | `org_id`, `userType`, `token` |
| Browser | `window.location.hostname` |

### Embedded Mode

When `isEmbeddedMode()` is true:

- header is hidden,
- sidebar is hidden,
- dynamic header is hidden,
- main content uses `ml-0 pt-4`.

### Employee Mode

Employee mode is true when:

```ts
localStorage.getItem("userType") === "pms_occupant"
```

It applies only with the local/FM-compatible condition.

Working:

- Employee users do not get the normal dynamic header.
- Employee users get `EmployeeHeader` or `TopNavigation`.
- Employee sidebar appears only for selected sections like `Project Task`.
- Other employee modules use no sidebar.

### Important Site Conditions

| Condition | Meaning |
| --- | --- |
| `isClubManagementRoute` | Club domain or `/club-management` path |
| `isViSite` | Host includes `vi-web.gophygital.work` |
| `isOmanSite` | Host includes `oig.gophygital.work` |
| `isFMSite` | FM/web/lockated host |
| `isPulseSite` | Pulse domain or `/pulse` path |
| `isLocalhost` | Local/FM-compatible host or selected test emails |

### Sidebar Selection

`renderSidebar()` returns the first matching sidebar:

| Condition | Sidebar |
| --- | --- |
| Embedded mode | none |
| VI site | `ViSidebar` |
| Club route/site | `ClubSidebar` |
| Admin Compass | `AdminCompassSidebar` |
| Business Compass | `BusinessCompassSidebar` |
| Employee + Project Task | `EmployeeSidebar` or `EmployeeSidebarStatic` |
| Employee + other section | none |
| Action allowlist | `ActionSidebar` |
| Company `189` | `ZxSidebar` |
| Oman site | `OmanSidebar` |
| VI token access | `ViSidebarWithToken` |
| Company `294` | `ZycusSidebar` |
| `org_id === "3"` | `ZycusSidebarCopy` |
| Company `304` | `PrimeSupportSidebar` |
| Company `305` or Pulse site | `PulseSidebar` |
| Config fallback | `StacticSidebar` |

Condition note:

- `ViSidebarWithToken` is mostly unreachable because the plain VI site check happens earlier.

### Dynamic Header Selection

`renderDynamicHeader()` returns the first matching header:

| Condition | Header |
| --- | --- |
| Embedded mode | none |
| VI site | `ViDynamicHeader` |
| Club route/site | `ClubDynamicHeader` |
| Employee mode | none |
| Action allowlist | `ActionHeader` |
| Company `189` | `ZxDynamicHeader` |
| `org_id === "3"` | `ZycusDynamicHeaderCopy` |
| FM site | `StaticDynamicHeader` |
| Oman site | `OmanDynamicHeader` |
| Company `294` | `ZycusDynamicHeader` |
| Company `304` | `PrimeSupportDynamicHeader` |
| Company `305` or Pulse site | `PulseDynamicHeader` |
| Config fallback | `StaticDynamicHeader` |

### Action Allowlist

Action layout is used for selected companies, orgs, or emails.

Company IDs:

- `300`
- `295`
- `298`
- `199`
- `307`

Org IDs:

- `90`
- `1`
- `84`

Selected emails include internal/test users such as `ubaid.hashmat@lockated.com`, `deveshjain928@gmail.com`, `abdul.ghaffar@lockated.com`, `mailroom2@zs.com`, and `abdul.g@gophygital.work`.

### URL Token Login

The layout reads these URL params:

- `access_token`
- `company_id`
- `user_id`

When `access_token` exists:

1. It stores the token.
2. It saves `live-api.gophygital.work/` as base URL for VI/localhost.
3. It stores `selectedCompanyId` if `company_id` exists.
4. It stores `user_id` if present.
5. It creates and saves a minimal VI token user.

Generated VI user:

```ts
{
  id: Number(user_id),
  email: "",
  firstname: "VI",
  lastname: "User",
  access_token,
  user_type: "vi_token_user"
}
```

### Main Header

| Condition | Header |
| --- | --- |
| Embedded mode | none |
| Employee + allowlist | `EmployeeHeader` |
| Employee + not allowlisted | `TopNavigation` |
| Other users | `Header` |

### Main Content Spacing

Embedded:

- `ml-0 pt-4`

Employee:

- compass/project sections use `ml-16` when collapsed or `ml-64` when expanded,
- other employee sections use `ml-0`,
- top padding is usually `pt-16`,
- `/employee/company-hub-new` uses `pt-6`.

Action sidebar:

- `ml-64 pt-28`

Normal:

- collapsed sidebar uses `ml-16`,
- expanded sidebar uses `ml-64`,
- top padding uses `pt-28`.

### Protection Layer

The layout always renders:

```tsx
<ProtectionLayer enabled={true} allowedDomains={["vi-web.gophygital.work"]} />
```

## Related Layout Context

`LayoutContext.tsx` stores:

- current section,
- sidebar collapsed state,
- company layout lookup helper.

It maps route prefixes to sections such as `Utility`, `Security`, `Maintenance`, `Settings`, `Dashboard`, and `Pulse Privilege`.

For employee or Pulse site conditions, route auto-detection is skipped for most routes so those UIs can control section state manually.

## Maintenance Notes

- `clearAuth()` clears all localStorage.
- `getUser()` can fail on invalid JSON.
- `verifyOTP()` uses a hardcoded API URL.
- `loginUser()` expects domain-only `baseUrl`.
- Some layout conditions are duplicated or unreachable.
- `selectedSite` is read in `Layout.tsx` but not used.
