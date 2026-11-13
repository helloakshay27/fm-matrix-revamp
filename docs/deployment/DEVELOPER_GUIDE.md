# Production Readiness — Developer Guide

What actually happens when you raise a PR, what the bot can and cannot see, and
what to do when it complains.

For the full item-by-item list see [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md).
For setting the kit up in another repo see [ADOPTING.md](ADOPTING.md).

---

## The one-minute version

1. You open a PR into `main` (or `Pulse-prod-main` / `Club-House-Main`).
2. A bot posts **one comment**: 🚦 Production Readiness Report.
3. You fix the ❌ items, look at the ⚠️ items, and tick the manual boxes in the PR description.
4. Three people tick their sign-off. You merge. You tag the release.

That's it. Right now **nothing blocks your merge** — the report is informational.

---

## When does it run?

| Situation | Does the bot run? |
|---|---|
| PR from `feature/x` → `main` | ✅ Yes |
| PR from `feature/x` → `Pulse-prod-main` or `Club-House-Main` | ✅ Yes |
| PR from `feature/x` → `api-integration-ui` or any other branch | ❌ No — it only guards production branches |
| You push 5 more commits to an open PR | ✅ Re-runs, and **edits the same comment** instead of adding new ones |
| You edit the PR description | ✅ Re-runs — this is how sign-offs register |
| You push straight to `main` with no PR | ❌ No. The checklist can't help you here |

---

## The single most important thing to understand

**The code checks only look at lines you added.**

The bot diffs your branch against the merge-base with the target branch and
collects added lines only. It does not care about the rest of the repo.

So:

- The repo currently has **5,597 `console.log` calls**. They appear in the report as an
  ℹ️ info line. They are *never* your problem and can never fail your PR.
- If you add one new `console.log`, you get a ⚠️ warning with the exact `file:line`.

You are judged on what you changed. Nothing else.

---

## Scenarios

### You left a `console.log` in

> ⚠️ `src/pages/settings/LockModuleList.tsx:142` — `console.log("modules", data)`

Not blocking. Also note `vite.config.ts` strips `console.log` and `debugger` from
production builds, so a stray one never actually ships. Still — delete it.

### You left a `debugger` statement in

> ❌ 1 new debugger statement

This one is a **fail**, not a warning. Delete it.

### You hardcoded a localhost URL

> ❌ `src/services/someService.ts:12` — `const API = "http://localhost:3000"`

A fail. This app resolves its API base URL **at runtime, per tenant** — the login
response gives you the base URL and it lives in `localStorage`. There is no build-time
API env var. Read it the way `src/utils/auth.ts` does instead of hardcoding anything.

Same fail for `127.0.0.1`, `0.0.0.0`, `ngrok`, `*.local` and `192.168.*`.

### You pointed something at UAT

> ⚠️ New non-production host: `uat.lockated.com`

A warning, not a fail, because tenant routing in `src/utils/auth.ts` legitimately names
UAT hosts. If your change isn't tenant routing, you probably left a test endpoint behind.

### You used a host nobody recognises

> ⚠️ New URL uses an unknown host: `api.some-vendor.io`

The allowlist is `scan.allowedHostSuffixes` in `readiness.config.json`. If the host is
legitimate and permanent, add it there in the same PR and say why in the description.

### The production build fails

> ❌ Production build (npm run build): failure

The one check that matters more than all the others — **a failing build cannot be
deployed**. Note that the other steps still ran and still reported, so you get the
lint/type/security results in the same comment rather than having to fix the build
first just to see them.

### Typecheck fails

> ❌ TypeScript (tsc --noEmit): failure

Be careful reading this one in this repo. TypeScript **skips all semantic analysis when
any file has a syntax error**, and six dead backup files currently have syntax errors:

```
src/hooks/usePermissionAwareNavigation.ts
src/pages/master/WingPageBackup.tsx
src/pages/ParkingCreatePageBackup.tsx
src/pages/settings/AddRolePageOld.tsx
src/pages/settings/RoleConfigCreate.tsx
src/pages/TicketListDashboard_backup.tsx
```

So this step reports failure for the whole repo regardless of your changes. Deleting
those six files is the prerequisite for this check to mean anything.

### You committed a `.env` file

> ❌ .env file committed

A fail, always. `.env.example` is fine; a real `.env` is not. Remove it from the commit,
and rotate anything that was in it.

### You hardcoded a key or token

> ❌ `src/api/client.ts:8` — `Authorization: "Bearer eyJhbGciOi..."`

A fail. Covers API keys, passwords, Bearer tokens, AWS keys, JWTs and private keys.
No third-party API that needs a secret should be called from the browser at all.

### You forgot to bump the version

> ⚠️ Release version: 1.0.0 (base: 1.0.0)

Bump `version` in `package.json` for every release. The bot compares your version
against the target branch's.

### There's no tag to roll back to

> ⚠️ No release tag found — nothing to roll back to

Tag production releases: `git tag v1.4.0 && git push origin v1.4.0`. Without tags, your
rollback plan has nothing to name.

### QA ticks their sign-off

The report re-runs on PR-description edits and flips that line from ❌ to ✅. The
sign-offs are read straight out of the PR body by pattern:

```
- [x] **QA**: @someone — verified on UAT
```

Keep the `**Developer**` / `**QA**` / `**Frontend Lead**` labels exactly as the template
writes them. Rename one and the bot silently stops seeing it.

---

## What the bot cannot check

Nineteen items are marked 📝 **manual** because no script can see your browser:

- Login, logout and session expiry
- **RBAC** — that every Add / Edit / View / bulk action is gated with
  `useDynamicPermissions().shouldShow(...)`
- That changed API calls succeed, and that errors are *shown to the user* rather than
  failing silently
- Responsive layout, no cut-off content, working pagination
- Chrome / Safari / Firefox / Edge
- That the logo, favicon, title and theme are right for **every tenant layout** you touched
- QA verification on UAT
- A written rollback plan

These are the ones that actually catch production incidents. The automated half just
clears the mechanical noise out of the way so reviewers can spend their attention here.

---

## Report mode vs enforce mode

**Today: `report` mode.** Every run is green. The comment is advice. Nothing is blocked.

**Later: `enforce` mode.** Set the repo variable `READINESS_MODE=enforce`, and a single ❌
exits non-zero and fails the job.

Two things to know about that switch:

1. It only blocks merges if `production-readiness` is *also* added to the branch
   protection rules as a required check. The variable by itself blocks nothing.
2. Don't flip it until the six unparseable files are deleted, or every PR fails on a
   typecheck error nobody introduced.

---

## Running it yourself, before you push

```bash
npm run readiness -- --base origin/main
```

Same script, same output, no waiting on CI. Use the branch you're actually targeting.

---

## Release steps

1. Bump `version` in `package.json`.
2. Open the PR using the template. Wait for the report.
3. Fix every ❌, or explain it in the PR. Read each ⚠️.
4. Get the three sign-offs plus the required approvals. Merge.
5. Tag it: `git tag v1.4.0 && git push origin v1.4.0`.

## Rollback

| Deploy path | How to roll back |
|---|---|
| `main` (AWS CodeDeploy) | Redeploy the previous successful revision, or revert the merge commit |
| EC2 via GitHub Actions | Re-run the workflow for the previous tag, or revert and push |
| Any | `git checkout vX.Y.Z`, build, redeploy `dist/` |

Write the tag or revision you'd roll back to in the PR **before** you merge. Deciding
that during an incident is how five-minute rollbacks become one-hour ones.
